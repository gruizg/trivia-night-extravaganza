package learn.trivia.domain;

import learn.trivia.data.doubles.ResponseRepositoryDouble;
import learn.trivia.data.doubles.TeamRepositoryDouble;

import static org.junit.jupiter.api.Assertions.*;

class TeamServiceTest {

    TeamService service = new TeamService(new TeamRepositoryDouble(), new ResponseRepositoryDouble());

}