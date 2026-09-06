package learn.trivia.controllers;

import learn.trivia.domain.Result;
import learn.trivia.domain.TeamService;
import learn.trivia.models.Team;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173"})
@RequestMapping("/api/team")
public class TeamController {

    private final TeamService service;

    public TeamController(TeamService service) {
        this.service = service;
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<Team> findById(@PathVariable int teamId) {
        Team team = service.findById(teamId);
        if (team == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(team);
    }

    @GetMapping("/all/{gameId}")
    public List<Team> findByGame(@PathVariable int gameId) {
        return service.findByGame(gameId);
    }

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Team team) {
        Result<Team> result = service.add(team);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }
    //TODO: IMPLEMENT

}
