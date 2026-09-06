package learn.trivia.data;

import learn.trivia.models.Game;
import learn.trivia.models.Team;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static learn.trivia.TestDataHelpers.Models.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class TeamJdbcClientRepositoryTest {

    @Autowired
    TeamJdbcClientRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() { knownGoodState.set(); }

    @Nested
    class Read {

        @Test
        void shouldFindById() {
            Team team = repository.findById(1);

            Game game = makeExistingGame();
            assertNotNull(team);
            assertEquals("token", team.getTeamToken());
            assertEquals(1, team.getTeamNumber());
            assertEquals("name", team.getTeamName());
            assertEquals(makeExistingGame(), team.getGame());
        }

        @Test
        void shouldFindByGame() {
            List<Team> teams = repository.findByGame(1);

            assertNotNull(teams);
            assertEquals(2, teams.size());
        }

        @Test
        void shouldFindTeamName() {
            assertTrue(repository.teamNameExists(1, "name"));
        }

        @Test
        void shouldNotFindTeamName() {
            assertFalse(repository.teamNameExists(1, "bad name"));
        }
    }

    @Nested
    class Create {

        @Test
        void shouldAdd() {
            Team toAdd = makeExistingTeam();
            toAdd.setTeamId(0);
            toAdd.setTeamNumber(3);

            Team expected = makeExistingTeam();
            expected.setTeamId(3);
            expected.setTeamNumber(3);

            Team actual = repository.add(toAdd);

            assertNotNull(actual);
            assertEquals(expected, actual);
        }
    }

}