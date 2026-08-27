package learn.trivia.models;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;

import static org.junit.jupiter.api.Assertions.*;
import static learn.trivia.TestDataHelpers.Models.*;

class TeamTest {

    @Test
    void shouldCorrectlyInitializeFields() {
        Team team = makeTeam();

        assertEquals(1, team.getTeamId());
        assertEquals("token", team.getTeamToken());
        assertEquals(1, team.getTeamNumber());
        assertEquals("name", team.getTeamName());
        assertEquals(makeGame(), team.getGame());
    }

    @Test
    void shouldBeSameTeam() {
        Team team1 = makeTeam();
        Team team2 = new Team(1, "token", 1, "name", makeGame());

        assertEquals(team1, team2);
    }

    @Nested
    class DifferentTeams {
        @Test
        void notEqualWhenIdIsDifferent() {
            Team team1 = makeTeam();
            Team team2 = makeTeam();
            team2.setTeamId(2);

            assertNotEquals(team1, team2);
        }

        @Test
        void notEqualWhenTokenIsDifferent() {
            Team team1 = makeTeam();
            Team team2 = makeTeam();
            team2.setTeamToken("token2");

            assertNotEquals(team1, team2);
        }

        @Test
        void notEqualWhenNumberIsDifferent() {
            Team team1 = makeTeam();
            Team team2 = makeTeam();
            team2.setTeamNumber(2);

            assertNotEquals(team1, team2);
        }

        @Test
        void notEqualWhenNameIsDifferent() {
            Team team1 = makeTeam();
            Team team2 = makeTeam();
            team2.setTeamName("name2");

            assertNotEquals(team1, team2);
        }

        @Test
        void notEqualWhenGameIsDifferent() {
            Team team1 = makeTeam();
            Team team2 = makeTeam();
            Game game = makeGame();
            game.setGameId(2);
            team2.setGame(game);

            assertNotEquals(team1, team2);
        }
    }

}