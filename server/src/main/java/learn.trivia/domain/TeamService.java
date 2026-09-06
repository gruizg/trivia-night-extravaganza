package learn.trivia.domain;

import learn.trivia.data.GameRepository;
import learn.trivia.data.TeamRepository;
import learn.trivia.models.Game;
import learn.trivia.models.GameStatus;
import learn.trivia.models.Team;
import org.springframework.stereotype.Service;

import java.util.List;

import static learn.trivia.domain.CodeGenerator.generateToken;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final GameRepository gameRepository;

    public TeamService(TeamRepository teamRepository, GameRepository gameRepository) {
        this.teamRepository = teamRepository;
        this.gameRepository = gameRepository;
    }

    public Team findById(int teamId) {
        return teamRepository.findById(teamId);
    }

    public List<Team> findByGame(int gameId) {
        return teamRepository.findByGame(gameId);
    }

    public Result<Team> add(Team team) {
        Result<Team> result = new Result<>();

        if (team == null) {
            result.addMessage("No values to `add`", ResultType.INVALID);
            return result;
        }

        if (team.getGame() == null) {
            result.addMessage("Game is required", ResultType.INVALID);
            return result;
        }

        if (team.getTeamId() != 0) {
            result.addMessage("Team id cannot be set for `add` operation", ResultType.INVALID);
        }

        if (team.getTeamToken() != null) {
            result.addMessage("Team token cannot be set for `add` operation", ResultType.INVALID);
        }

        if (team.getTeamNumber() != 0) {
            result.addMessage("Team number cannot be set for `add` operation", ResultType.INVALID);
        }

        if (team.getTeamName() == null || team.getTeamName().isBlank()) {
            result.addMessage("Team name is required", ResultType.INVALID);
        }

        if (team.getGame().getGameId() <= 0) {
            result.addMessage("Game is invalid", ResultType.INVALID);
        }

        if (!result.isSuccess()) {
            return result;
        }

        Game game = gameRepository.findById(team.getGame().getGameId());

        if (game.getGameStatus() != GameStatus.LOBBY) {
            result.addMessage("Teams cannot be added once the game has left the lobby", ResultType.INVALID);
            return result;
        }

        if (teamRepository.teamNameExists(game.getGameId(), team.getTeamName())) {
            result.addMessage("Team name already used", ResultType.INVALID);
            return result;
        }

        String token = generateUniqueTeamToken();
        if (token == null) {
            result.addMessage("Unable to generate team token", ResultType.ERROR);
            return result;
        }

        team.setTeamToken(token);
        team = teamRepository.add(team);
        result.setPayload(team);

        return result; //TODO: IMPLEMENT
    }

    private String generateUniqueTeamToken() {
        String token;
        for (int i = 0; i < 10; i++) {
            token = generateToken();
            if (!(teamRepository.teamTokenExists(token) || token.isBlank())) {
                return token;
            }
        }
        return null;
    }
    //TODO: IMPLEMENT

}