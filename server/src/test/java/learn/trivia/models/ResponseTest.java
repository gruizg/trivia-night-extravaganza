package learn.trivia.models;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static learn.trivia.TestDataHelpers.Models.*;

class ResponseTest {

    @Test
    void shouldCorrectlyInitializeFields() {
        Response response = makeExistingResponse();

        assertEquals(1, response.getResponseId());
        assertEquals("answer", response.getResponseAnswer());
        assertEquals(1, response.getResponseWager());
        assertEquals(ResponseStatus.INCORRECT, response.getResponseStatus());
        assertEquals(0, response.getResponsePoints());
        assertEquals(makeExistingTeam(), response.getTeam());
        assertEquals(makeExistingQuestion(), response.getQuestion());
    }

    @Test
    void shouldBeSameResponse() {
        Response response1 = makeExistingResponse();
        Response response2 = new Response(1, "answer", 1, ResponseStatus.INCORRECT, 0, makeExistingTeam(), makeExistingQuestion());

        assertEquals(response1, response2);
    }

    @Nested
    class DifferentResponses {

        @Test
        void notEqualWhenIdIsDifferent() {
            Response response1 = makeExistingResponse();
            Response response2 = makeExistingResponse();
            response2.setResponseId(2);

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenAnswerIsDifferent() {
            Response response1 = makeExistingResponse();
            Response response2 = makeExistingResponse();
            response2.setResponseAnswer("answer2");

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenWagerIsDifferent() {
            Response response1 = makeExistingResponse();
            Response response2 = makeExistingResponse();
            response2.setResponseWager(3);

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenCorrectIsDifferent() {
            Response response1 = makeExistingResponse();
            Response response2 = makeExistingResponse();
            response2.setResponseStatus(ResponseStatus.CORRECT);

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenPointsAreDifferent() {
            Response response1 = makeExistingResponse();
            Response response2 = makeExistingResponse();
            response2.setResponsePoints(1);

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenTeamIsDifferent() {
            Response response1 = makeExistingResponse();
            Response response2 = makeExistingResponse();
            Team team = makeExistingTeam();
            team.setTeamId(2);
            response2.setTeam(team);

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenQuestionIsDifferent() {
            Response response1 = makeExistingResponse();
            Response response2 = makeExistingResponse();
            Question question = makeExistingQuestion();
            question.setQuestionId(2);
            response2.setQuestion(question);

            assertNotEquals(response1, response2);
        }

    }

    @Nested
    class AwardingPoints {

        @Test
        void shouldAwardPointsForCorrectAnswer() {
            Response response = makeNewResponse();
            response.setResponseStatus(ResponseStatus.CORRECT);

            assertEquals(ResponseStatus.CORRECT, response.getResponseStatus());
            assertEquals(response.getResponseWager(), response.getResponsePoints());
        }

        @Test
        void shouldNotAwardPointsForWrongAnswer() {
            Response response = makeNewResponse();
            response.setResponseStatus(ResponseStatus.INCORRECT);

            assertEquals(ResponseStatus.INCORRECT, response.getResponseStatus());
            assertEquals(0, response.getResponsePoints());
        }
    }

}