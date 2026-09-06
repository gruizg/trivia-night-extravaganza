package learn.trivia.domain;

import learn.trivia.data.GameRepository;
import learn.trivia.models.Game;
import learn.trivia.models.GameStatus;
import org.springframework.stereotype.Service;

import static learn.trivia.domain.CodeGenerator.*;

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public Game findById(int gameId) {
        return gameRepository.findById(gameId);
    }

    public Game findByCode(String gameCode) {
        return gameRepository.findByCode(gameCode);
    }

    public Result<Game> add(Game game) {

        Result<Game> result = new Result<>();

        if (game == null) {
            result.addMessage("No values to `add`", ResultType.INVALID);
            return result;
        }

        if (game.getTheme() == null) {
            result.addMessage("Theme is required", ResultType.INVALID);
            return result;
        }

        if (game.getGameId() != 0) {
            result.addMessage("Game id cannot be set for `add` operation", ResultType.INVALID);
        }

        if (game.getGameCode() != null) {
            result.addMessage("Game code cannot be set for `add` operation", ResultType.INVALID);
        }

        if (game.getHostToken() != null) {
            result.addMessage("Host token cannot be set for `add` operation", ResultType.INVALID);
        }

        if (game.getGameStatus() != null) {
            result.addMessage("Game status cannot be set for `add` operation", ResultType.INVALID);
        }

        if (game.getCurrentRound() != 0) {
            result.addMessage("Current round cannot be set for `add` operation", ResultType.INVALID);
        }

        if (game.getCurrentQuestion() != null) {
            result.addMessage("Current question cannot be set for `add` operation", ResultType.INVALID);
        }

        if (game.getTheme().getThemeId() <= 0) {
            result.addMessage("Theme is invalid", ResultType.INVALID);
        }

        if (!result.isSuccess()) {
            return result;
        }

        String code = generateUniqueGameCode();
        if (code == null) {
            result.addMessage("Unable to generate game code", ResultType.ERROR);
            return result;
        }
        game.setGameCode(code);
        game.setHostToken(generateToken());
        game.setGameStatus(GameStatus.LOBBY);
        game = gameRepository.add(game);
        result.setPayload(game);
        return result;
    }

    public Result<Game> update(Game game) {

        Result<Game> result = new Result<>();

        if (game == null) {
            result.addMessage("No values to update", ResultType.INVALID);
            return result;
        }

        Game existing = gameRepository.findById(game.getGameId());

        if (existing == null) {
            result.addMessage("Game not found", ResultType.NOT_FOUND);
            return result;
        }

        if (game.getGameCode() == null || game.getGameCode().isBlank()) {
            result.addMessage("Game code is required for `update` operation", ResultType.INVALID);
        }

        if (game.getHostToken() == null || game.getHostToken().isBlank()) {
            result.addMessage("Host token is required for `update` operation", ResultType.INVALID);
        }

        if (game.getGameStatus() == null) {
            result.addMessage("Game status is required for `update` operation", ResultType.INVALID);
        }

        if (game.getTheme() == null) {
            result.addMessage("Theme is required for `update` operation", ResultType.INVALID);
        }

        if (!result.isSuccess()) {
            return result;
        }

        if (!game.getGameCode().equals(existing.getGameCode())) {
            result.addMessage("Game code cannot be updated", ResultType.INVALID);
        }

        if (!game.getHostToken().equals(existing.getHostToken())) {
            result.addMessage("Host token cannot be updated", ResultType.INVALID);
        }

        if (game.getGameStatus() == GameStatus.LOBBY) {
            result.addMessage("Game status cannot be reset to lobby", ResultType.INVALID);
        }

        if (game.getCurrentRound() < 0) {
            result.addMessage("Current round cannot be negative", ResultType.INVALID);
        }

        if (game.getTheme().getThemeId() <= 0) {
            result.addMessage("Theme is invalid", ResultType.INVALID);
        }

        if (!(game.getTheme().equals(existing.getTheme()))) {
            result.addMessage("Theme cannot be updated", ResultType.INVALID);
        }

        if (!result.isSuccess()) {
            return result;
        }

        if (gameRepository.update(game)) {
            result.setPayload(game);
            return result;
        }

        result.addMessage("Unable to update", ResultType.ERROR);
        return result;
    }

    private String generateUniqueGameCode() {
        String code = "";
        for (int i = 0; i < 10; i++) {
            code = generateGameCode();
            if (!(gameRepository.gameCodeExists(code) || code.isBlank())) {
                return code;
            }
        }
        return null;
    }

}