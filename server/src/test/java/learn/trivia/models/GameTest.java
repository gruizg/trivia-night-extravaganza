package learn.trivia.models;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;

import static org.junit.jupiter.api.Assertions.*;
import static learn.trivia.TestDataHelpers.Models.*;

class GameTest {

    @Test
    void shouldCorrectlyInitializeFields() {
        Game game = makeExistingGame();

        assertEquals(1, game.getGameId());
        assertEquals("code", game.getGameCode());
        assertEquals("token", game.getHostToken());
        assertEquals(GameStatus.LOBBY, game.getGameStatus());
        assertEquals(makeExistingTheme(), game.getTheme());
    }

    @Test
    void shouldBeSameGame() {
        Game game1 = makeExistingGame();
        Game game2 = new Game(1, "code", "token", GameStatus.LOBBY, 1, makeExistingQuestion(), makeExistingTheme());

        assertEquals(game1, game2);
    }

    @Nested
    class DifferentGames {

        @Test
        void notEqualWhenIdIsDifferent() {
            Game game1 = makeExistingGame();
            Game game2 = makeExistingGame();
            game2.setGameId(2);

            assertNotEquals(game1, game2);
        }

        @Test
        void notEqualWhenCodeIsDifferent() {
            Game game1 = makeExistingGame();
            Game game2 = makeExistingGame();
            game2.setGameCode("code2");

            assertNotEquals(game1, game2);
        }

        @Test
        void notEqualWhenTokenIsDifferent() {
            Game game1 = makeExistingGame();
            Game game2 = makeExistingGame();
            game2.setHostToken("token2");

            assertNotEquals(game1, game2);
        }

        @Test
        void notEqualWhenStatusIsDifferent() {
            Game game1 = makeExistingGame();
            Game game2 = makeExistingGame();
            game2.setGameStatus(GameStatus.QUESTION);

            assertNotEquals(game1, game2);
        }

        @Test
        void notEqualWhenRoundIsDifferent() {
            Game game1 = makeExistingGame();
            Game game2 = makeExistingGame();
            game2.setCurrentRound(2);

            assertNotEquals(game1, game2);
        }

        @Test
        void notEqualWhenQuestionIsDifferent() {
            Game game1 = makeExistingGame();
            Game game2 = makeExistingGame();
            Question question = makeExistingQuestion();
            question.setQuestionId(2);
            game2.setCurrentQuestion(question);

                    assertNotEquals(game1, game2);
        }

        @Test
        void notEqualWhenThemeIsDifferent() {
            Game game1 = makeExistingGame();
            Game game2 = makeExistingGame();
            Theme theme = makeExistingTheme();
            theme.setThemeId(2);
            game2.setTheme(theme);

            assertNotEquals(game1, game2);
        }
    }

}