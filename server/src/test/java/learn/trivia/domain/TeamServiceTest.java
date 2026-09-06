package learn.trivia.domain;

import learn.trivia.data.doubles.GameRepositoryDouble;
import learn.trivia.data.doubles.TeamRepositoryDouble;
import learn.trivia.models.*;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.List;

import static learn.trivia.TestDataHelpers.Models.*;
import static org.junit.jupiter.api.Assertions.*;

class TeamServiceTest {

    TeamService service = new TeamService(new TeamRepositoryDouble(), new GameRepositoryDouble());

    //TODO: IMPLEMENT TESTS

    @Nested
    class Read {

        @Test
        void shouldFindById() {
            Team expected = makeExistingTeam();
            Team actual = service.findById(1);

            assertNotNull(actual);
            assertEquals(expected, actual);
        }

        @Test
        void shouldNotFindByIdWhenMissing() {
            Team actual = service.findById(999);

            assertNull(actual);
        }

        @Test
        void shouldFindByGame() {
            List<Team> actual = service.findByGame(1);

            assertEquals(2, actual.size());
        }

        @Test
        void shouldNotFindByGameWhenMissing() {
            List<Team> actual = service.findByGame(999);

            assertTrue(actual.isEmpty());
        }
    }

    @Nested
    class CreateTeam {

        @Test
        void shouldAdd() {
            Team toCreate = makeNewTeam();

            Result<Team> result = service.add(toCreate);

            assertTrue(result.isSuccess());
            assertEquals(ResultType.SUCCESS, result.getType());
            assertNotNull(result.getPayload());

            Team actual = result.getPayload();
            assertEquals(3, actual.getTeamId());
            assertNotNull(actual.getTeamToken());
            assertFalse(actual.getTeamToken().isBlank());
            assertEquals(toCreate.getTeamName(), actual.getTeamName());
            assertEquals(3, actual.getTeamNumber());
        }

        @Test
        void shouldNotAddWhenNull() {
            Result<Team> result = service.add(null);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("No values to `add`"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenIdIsSet() {
            Team toCreate = makeNewTeam();
            toCreate.setTeamId(2);

            Result<Team> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Team id cannot be set for `add` operation"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenTokenIsSet() {
            Team toCreate = makeNewTeam();
            toCreate.setTeamToken("bad token");

            Result<Team> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Team token cannot be set for `add` operation"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenNumberIsSet() {
            Team toCreate = makeNewTeam();
            toCreate.setTeamNumber(1);

            Result<Team> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Team number cannot be set for `add` operation"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenNameIsEmpty() {
            Team toCreate = makeNewTeam();
            toCreate.setTeamName(" ");

            Result<Team> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Team name is required"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenNameIsNull() {
            Team toCreate = makeNewTeam();
            toCreate.setTeamName(null);

            Result<Team> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Team name is required"));
        }

        @Test
        void shouldNotAddWhenNameIsDuplicate() {
            Team toCreate = makeNewTeam();
            toCreate.setTeamName("name");

            Result<Team> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Team name already used"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenGameIsNull() {
            Team toCreate = makeNewTeam();
            toCreate.setGame(null);

            Result<Team> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Game is required"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenGameIsInvalid() {
            Team toCreate = makeNewTeam();
            Game game = makeExistingGame();
            game.setGameId(-1);
            toCreate.setGame(game);

            Result<Team> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Game is invalid"));
            assertNull(result.getPayload());
        }

        @Test
        void shouldNotAddWhenGameNotInLobby() {
            Team toCreate = makeNewTeam();
            Game game = makeExistingGame();
            game.setGameStatus(GameStatus.QUESTION);
            toCreate.setGame(game);

            Result<Team> result = service.add(toCreate);

            assertEquals(ResultType.INVALID, result.getType());
            assertTrue(result.getMessages().contains("Teams cannot be added once the game has left the lobby"));
            assertNull(result.getPayload());
        }

    }

}