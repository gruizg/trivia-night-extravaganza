package learn.trivia.domain;

import learn.trivia.data.doubles.GameRepositoryDouble;
import learn.trivia.models.Game;
import learn.trivia.models.GameStatus;
import learn.trivia.models.Theme;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;

import static learn.trivia.TestDataHelpers.Models.*;
import static org.junit.jupiter.api.Assertions.*;

class GameServiceTest {

    GameService service;

    @BeforeEach
    void setup() {
        service = new GameService(new GameRepositoryDouble());
    }

    @Nested
    class Read {

        @Test
        void shouldFindById() {
            Game expected = makeExistingGame();
            Game actual = service.findById(1);

            assertNotNull(actual);
            assertEquals(expected, actual);
        }

        @Test
        void shouldNotFindByIdWhenMissing() {
            Game actual = service.findById(999);

            assertNull(actual);
        }

        @Test
        void shouldFindByCode() {
            Game expected = makeExistingGame();
            Game actual = service.findByCode("code");

            assertNotNull(actual);
            assertEquals(expected, actual);
        }

        @Test
        void shouldNotFindByCodeWhenMissing() {
            Game actual = service.findByCode("bad-code");

            assertNull(actual);
        }
    }

    @Nested
    class Create {

        @Test
        void shouldAdd() {
            Game toCreate = makeNewGame();

            Result<Game> result = service.add(toCreate);

            assertEquals(ResultType.SUCCESS, result.getType());
            assertTrue(result.isSuccess());
            assertNotNull(result.getPayload());
            Game actual = result.getPayload();

            assertEquals(2, actual.getGameId());
            assertNotNull(actual.getGameCode());
            assertNotNull(actual.getHostToken());
            assertFalse(actual.getHostToken().isBlank());
            assertEquals(GameStatus.LOBBY, actual.getGameStatus());
            assertEquals(0, actual.getCurrentRound());
            assertNull(actual.getCurrentQuestion());
            assertEquals(toCreate.getTheme(), actual.getTheme());
        }

        @Test
        void shouldNotAddWhenNull() {
            Result<Game> result = service.add(null);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("No values to `add`"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenIdIsSet() {
            Game toCreate = makeNewGame();
            toCreate.setGameId(2);

            Result<Game> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Game id cannot be set for `add` operation"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenCodeIsSet() {
            Game toCreate = makeNewGame();
            toCreate.setGameCode("bad code");

            Result<Game> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Game code cannot be set for `add` operation"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenTokenIsSet() {
            Game toCreate = makeNewGame();
            toCreate.setHostToken("bad token");

            Result<Game> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Host token cannot be set for `add` operation"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenStatusIsSet() {
            Game toCreate = makeNewGame();
            toCreate.setGameStatus(GameStatus.RANKING);

            Result<Game> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Game status cannot be set for `add` operation"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenCurrentRoundIsSet() {
            Game toCreate = makeNewGame();
            toCreate.setCurrentRound(1);

            Result<Game> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Current round cannot be set for `add` operation"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenCurrentQuestionIsSet() {
            Game toCreate = makeNewGame();
            toCreate.setCurrentQuestion(makeExistingQuestion());

            Result<Game> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Current question cannot be set for `add` operation"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenThemeIsNull() {
            Game toCreate = makeNewGame();
            toCreate.setTheme(null);

            Result<Game> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Theme is required"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenThemeIsInvalid() {
            Game toCreate = makeNewGame();
            Theme theme = makeExistingTheme();
            theme.setThemeId(-1);
            toCreate.setTheme(theme);

            Result<Game> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Theme is invalid"));
            assertNull(result.getPayload());
        }

    }

    @Nested
    class Update {

        @Test
        void shouldUpdate() {
            Game toUpdate = makeExistingGame();
            toUpdate.setGameStatus(GameStatus.RANKING);
            toUpdate.setCurrentQuestion(null);

            Result<Game> result = service.update(toUpdate);
            assertTrue(result.isSuccess());
            assertEquals(ResultType.SUCCESS, result.getType());

            Game actual = service.findById(toUpdate.getGameId());
            assertEquals(toUpdate, actual);
        }

        @Test
        void shouldNotUpdateWhenNull() {
            Result<Game> result = service.update(null);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("No values to update"));
        }

        @Test
        void shouldNotUpdateWhenIdNotFound() {
            Game toUpdate = makeExistingGame();
            toUpdate.setGameId(999);

            Result<Game> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.NOT_FOUND, result.getType());
            assertTrue(result.getMessages().contains("Game not found"));
        }

        @Test
        void shouldNotUpdateWhenCodeIsMissing() {
            Game toUpdate = makeExistingGame();
            toUpdate.setGameCode(null);

            Result<Game> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Game code is required for `update` operation"));
        }

        @Test
        void shouldNotUpdateWhenCodeIsDifferent() {
            Game toUpdate = makeExistingGame();
            toUpdate.setGameCode("different-code");

            Result<Game> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Game code cannot be updated"));
        }

        @Test
        void shouldNotUpdateWhenTokenIsMissing() {
            Game toUpdate = makeExistingGame();
            toUpdate.setHostToken(null);

            Result<Game> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Host token is required for `update` operation"));
        }

        @Test
        void shouldNotUpdateWhenTokenIsDifferent() {
            Game toUpdate = makeExistingGame();
            toUpdate.setHostToken("different-token");

            Result<Game> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Host token cannot be updated"));
        }

        @Test
        void shouldNotUpdateWhenStatusIsMissing() {
            Game toUpdate = makeExistingGame();
            toUpdate.setGameStatus(null);

            Result<Game> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Game status is required for `update` operation"));
        }

        @Test
        void shouldNotUpdateWhenStatusIsLobby() {
            Game toUpdate = makeExistingGame();
            toUpdate.setGameStatus(GameStatus.LOBBY);

            Result<Game> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Game status cannot be reset to lobby"));
        }

        @Test
        void shouldNotUpdateWhenRoundIsInvalid() {
            Game toUpdate = makeExistingGame();
            toUpdate.setCurrentRound(-1);

            Result<Game> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Current round cannot be negative"));
        }

        @Test
        void shouldNotUpdateWhenThemeIsNull() {
            Game toUpdate = makeExistingGame();
            toUpdate.setTheme(null);

            Result<Game> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Theme is required for `update` operation"));
        }

        @Test
        void shouldNotUpdateWhenThemeIsInvalid() {
            Game toUpdate = makeExistingGame();
            Theme theme = makeExistingTheme();
            theme.setThemeId(0);
            toUpdate.setTheme(theme);

            Result<Game> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Theme is invalid"));
        }

        @Test
        void shouldNotUpdateWhenThemeIsDifferent() {
            Game toUpdate = makeExistingGame();
            Theme theme = makeExistingTheme();
            theme.setThemeId(999);
            toUpdate.setTheme(theme);

            Result<Game> result = service.update(toUpdate);

            assertFalse(result.isSuccess());
            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Theme cannot be updated"));
        }

    }

}