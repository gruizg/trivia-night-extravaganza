package learn.trivia.domain;

import learn.trivia.data.doubles.GameRepositoryDouble;

import static org.junit.jupiter.api.Assertions.*;

class GameServiceTest {

    GameService service = new GameService(new GameRepositoryDouble());

}