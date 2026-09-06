package learn.trivia.data;

import learn.trivia.models.Game;
import learn.trivia.models.GameStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static learn.trivia.TestDataHelpers.Models.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class GameJdbcClientRepositoryTest {

    @Autowired
    GameJdbcClientRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Nested
    class Read {

        @Test
        void shouldFindById() {

            Game game = repository.findById(1);

            assertNotNull(game);
            assertEquals("code", game.getGameCode());
            assertEquals("token", game.getHostToken());
            assertEquals(GameStatus.LOBBY, game.getGameStatus());
            assertEquals(1, game.getCurrentRound());
            assertEquals(makeExistingQuestion(), game.getCurrentQuestion());
            assertEquals(makeExistingTheme(), game.getTheme());
        }

        @Test
        void shouldFindByCode() {

            Game game = repository.findByCode("code");

            assertNotNull(game);
            assertEquals("code", game.getGameCode());
            assertEquals("token", game.getHostToken());
            assertEquals(GameStatus.LOBBY, game.getGameStatus());
            assertEquals(1, game.getCurrentRound());
            assertEquals(makeExistingQuestion(), game.getCurrentQuestion());
            assertEquals(makeExistingTheme(), game.getTheme());
        }

    }

    @Nested
    class Create {

        @Test
        void shouldAdd() {

            Game expected = makeExistingGame();
            expected.setGameId(2);
            Game actual = repository.add(makeExistingGame());

            assertNotNull(actual);
            assertEquals(expected, actual);
        }
    }

    @Nested
    class Update {

        @Test
        void shouldUpdate() {

            Game expected = makeExistingGame();
            expected.setGameStatus(GameStatus.RANKING);
            assertTrue(repository.update(expected));

            Game actual = repository.findById(1);
            assertEquals(expected, actual);
        }

        @Test
        void shouldNotUpdate() {
            Game game = makeExistingGame();
            game.setGameId(999);

            assertFalse(repository.update(game));
        }
    }
}