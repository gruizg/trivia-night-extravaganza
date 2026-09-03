package learn.trivia.data;

import learn.trivia.models.Game;

public interface GameRepository {

    Game findById(int gameId);

    Game findByCode(String gameCode);

    Game add(Game game);

    boolean update(Game game);

    boolean gameCodeExists(String code);

}
