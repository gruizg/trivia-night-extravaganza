package learn.trivia.data;

import learn.trivia.models.Team;

import java.util.List;

public interface TeamRepository {

    Team findById(int teamId);

    List<Team> findByGame(int gameId);

    Team add(Team team);

    boolean teamNameExists(int gameId, String name);

    boolean teamTokenExists(String token);
}