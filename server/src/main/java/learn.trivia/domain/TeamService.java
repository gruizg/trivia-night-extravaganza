package learn.trivia.domain;

import learn.trivia.data.ResponseRepository;
import learn.trivia.data.TeamRepository;
import org.springframework.stereotype.Service;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final ResponseRepository responseRepository;

    public TeamService(TeamRepository teamRepository, ResponseRepository responseRepository) {
        this.teamRepository = teamRepository;
        this.responseRepository = responseRepository;
    }

    //TODO: IMPLEMENT

}
