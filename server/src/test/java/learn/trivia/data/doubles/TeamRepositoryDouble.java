package learn.trivia.data.doubles;

import learn.trivia.data.TeamRepository;
import learn.trivia.models.Team;

import java.util.ArrayList;
import java.util.List;

import static learn.trivia.TestDataHelpers.Models.*;

public class TeamRepositoryDouble implements TeamRepository {

    ArrayList<Team> teams = new ArrayList<>();

    public TeamRepositoryDouble() {
        teams.add(makeExistingTeam());
        teams.add(new Team(2, "token 2", 2, "name 2", makeExistingGame()));
    }

    @Override
    public Team findById(int teamId) {
        return teams.stream().findFirst().filter(team -> team.getTeamId() == teamId).orElse(null);
    }

    @Override
    public List<Team> findByGame(int gameId) {
        return teams.stream().filter(team -> team.getGame().getGameId() == gameId).toList();
    }

    @Override
    public Team add(Team team) {
        team.setTeamId(3);
        return team;
    }

    @Override
    public boolean teamNameExists(int gameId, String name) {

        return teams.stream().filter(team -> team.getGame().getGameId() == gameId).anyMatch(team -> team.getTeamName().equals(name));
    }

    @Override
    public boolean teamTokenExists(String token) {

        return teams.stream().anyMatch(team -> team.getTeamToken().equals(token));
    }

}