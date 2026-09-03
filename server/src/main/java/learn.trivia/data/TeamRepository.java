package learn.trivia.data;

import learn.trivia.models.Team;

import java.util.List;

public interface TeamRepository {

    Team findById(int teamId);

    List<Team> findAll();

    Team add(Team team);

}