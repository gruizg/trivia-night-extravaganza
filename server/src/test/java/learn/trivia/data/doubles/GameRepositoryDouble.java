package learn.trivia.data.doubles;

import learn.trivia.data.GameRepository;
import learn.trivia.models.Game;

import java.util.ArrayList;

import static learn.trivia.TestDataHelpers.Models.makeExistingGame;

public class GameRepositoryDouble implements GameRepository {

    ArrayList<Game> games = new ArrayList<>();

    public GameRepositoryDouble() {
        games.add(makeExistingGame());
    }

    @Override
    public Game findById(int gameId) {
        return games.stream().findFirst().filter(game -> game.getGameId() == gameId).orElse(null);
    }

    @Override
    public Game findByCode(String gameCode) {
        return games.stream().findFirst().filter(game -> game.getGameCode().equals(gameCode)).orElse(null);
    }

    @Override
    public Game add(Game game) {
        game.setGameId(2);
        return game;
    }

    @Override
    public boolean update(Game game) {
        games.set(0, game);
        return game.getGameId() == 1;
    }

    @Override
    public boolean gameCodeExists(String code) {
        return games.stream().anyMatch(game -> game.getGameCode().equals(code));
    }

}