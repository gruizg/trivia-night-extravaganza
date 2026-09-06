package learn.trivia.domain;

import learn.trivia.data.doubles.ResponseRepositoryDouble;
import learn.trivia.data.doubles.TeamRepositoryDouble;
import learn.trivia.models.*;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static learn.trivia.TestDataHelpers.Models.*;
import static learn.trivia.TestDataHelpers.Models.makeExistingQuestion;
import static learn.trivia.TestDataHelpers.Models.makeNewResponse;
import static org.junit.jupiter.api.Assertions.*;

class ResponseServiceTest {

    ResponseService service = new ResponseService(new ResponseRepositoryDouble(), new TeamRepositoryDouble());

    @Nested
    class Read {

        @Test
        void shouldFindById() {
            Response expected = makeExistingResponse();
            Response actual = service.findById(1);

            assertNotNull(actual);
            assertEquals(expected, actual);
        }

        @Test
        void shouldNotFindWhenIdMissing() {
            Response actual = service.findById(999);

            assertNull(actual);
        }

        @Test
        void shouldFindByQuestionKey() {
            List<Response> actual = service.findByQuestion(1, 1);

            assertEquals(2, actual.size());
        }

        @Test
        void shouldNotFindWhenQuestionKeyMissing() {
            List<Response> actual = service.findByQuestion(1, 999);

            assertTrue(actual.isEmpty());
        }

        @Test
        void shouldFindByTeamKey() {
            List<Response> actual = service.findByTeam(1);

            assertEquals(3, actual.size());
        }

        @Test
        void shouldNotFindWhenTeamKeyMissing() {
            List<Response> actual = service.findByTeam(999);

            assertTrue(actual.isEmpty());
        }

        @Test
        void shouldFindOneRemainingWager() {
            List<Integer> expected = new ArrayList<>(List.of(5));
            List<Integer> actual = service.findAvailableWagers(1, 1);

            assertFalse(actual.isEmpty());
            assertEquals(expected, actual);
        }

    }


    @Nested
    class Create {

        @Test
        void shouldAdd() {
            Response toCreate = makeNewResponse();
            toCreate.setResponseWager(5);
            toCreate.getTeam().setGame(makeExistingGameInProgress());

            Result<Response> result = service.add(toCreate);

            assertTrue(result.isSuccess());
            assertEquals(ResultType.SUCCESS, result.getType());
            assertNotNull(result.getPayload());
            assertEquals(5, result.getPayload().getResponseId());
        }

        @Test
        void shouldNotAddWhenNull() {
            Result<Response> result = service.add(null);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("No values to `add`"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenTeamIsNull() {
            Response toCreate = makeNewResponse();
            toCreate.setTeam(null);

            Result<Response> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Team is required"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenQuestionIsNull() {
            Response toCreate = makeNewResponse();
            toCreate.setQuestion(null);

            Result<Response> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Question is required"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenWagerNotAvailableForRound() {
            Response toCreate = makeNewResponse();
            toCreate.setResponseWager(1);
            toCreate.getTeam().setGame(makeExistingGameInProgress());

            Result<Response> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Wager is not available for this round"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenWagerIsNegative() {
            Response toCreate = makeNewResponse();
            toCreate.getTeam().setGame(makeExistingGameInProgress());
            toCreate.setResponseWager(-1);

            Result<Response> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Wager cannot be negative"));
        }

        @Test
        void shouldNotAddWhenGameStatusNotQuestion() {
            Response toCreate = makeNewResponse();
            toCreate.setResponseWager(5);
            Game game = makeExistingGame();
            game.setGameStatus(GameStatus.RANKING);
            Team team = makeExistingTeam();
            team.setGame(game);

            Result<Response> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Submissions not accepted at this time"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldAddFinalQuestionWithWagerUpToFifteen() {
            Response toCreate = makeNewResponse();
            Question question = makeExistingQuestion();
            question.setQuestionType(QuestionType.FINAL);
            toCreate.setQuestion(question);
            toCreate.setResponseWager(15);
            toCreate.getTeam().setGame(makeExistingGameInProgress());

            Result<Response> result = service.add(toCreate);

            assertTrue(result.isSuccess());
            assertEquals(15, result.getPayload().getResponseWager());
        }

        @Test
        void shouldNotAddFinalQuestionWithWagerOverFifteen() {
            Response toCreate = makeNewResponse();
            Question question = makeExistingQuestion();
            question.setQuestionType(QuestionType.FINAL);
            toCreate.setQuestion(question);
            toCreate.setResponseWager(16);
            toCreate.getTeam().setGame(makeExistingGameInProgress());

            Result<Response> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Wager must be between 0 and 15"));
            assertNull(result.getPayload());
        }

    }

    @Nested
    class Update {

        @Test
        void shouldUpdate() {
            Response toUpdate = makeExistingResponse();
            toUpdate.setResponseCorrect(true);

            Result<Response> result = service.update(toUpdate);

            assertTrue(result.isSuccess());
            assertEquals(ResultType.SUCCESS, result.getType());

            Response actual = service.findById(1);
            assertTrue(actual.isResponseCorrect());
            assertEquals(toUpdate.getResponseWager(), actual.getResponsePoints());
        }

        @Test
        void shouldNotChangeWhenAnswerIsIncorrect() {
            Response toUpdate = makeExistingResponse();
            toUpdate.setResponseCorrect(false);

            Result<Response> result = service.update(toUpdate);

            assertTrue(result.isSuccess());
            assertEquals(ResultType.SUCCESS, result.getType());

            Response actual = result.getPayload();
            assertFalse(actual.isResponseCorrect());
            assertEquals(toUpdate, actual);
            assertEquals(makeExistingResponse(), actual);
        }

        @Test
        void shouldNotUpdateWhenIdIsMissing() {
            Response toUpdate = makeExistingResponse();
            toUpdate.setResponseId(0);

            Result<Response> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Response id is required for `update` operation"));
        }

        @Test
        void shouldNotUpdateWhenGameIsMissing() {
            Response toUpdate = makeExistingResponse();
            Team team = makeExistingTeam();
            team.setGame(null);
            toUpdate.setTeam(team);

            Result<Response> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Game is required for `update` operation"));
        }

        @Test
        void shouldNotUpdateWhenQuestionIsMissing() {
            Response toUpdate = makeExistingResponse();
            toUpdate.setQuestion(null);

            Result<Response> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Question is required for `update` operation"));
        }

        @Test
        void shouldNotUpdateWhenTeamIsMissing() {
            Response toUpdate = makeExistingResponse();
            toUpdate.setTeam(null);

            Result<Response> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Team is required for `update` operation"));
        }

    }
}