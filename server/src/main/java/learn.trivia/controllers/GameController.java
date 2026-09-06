package learn.trivia.controllers;

import learn.trivia.domain.GameService;
import learn.trivia.domain.Result;
import learn.trivia.models.Game;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<Game> findById(@PathVariable int gameId) {
        Game game = service.findById(gameId);

        if (game == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(game);
    }

    @GetMapping("/code/{gameCode}")
    public ResponseEntity<Game> findByCode(@PathVariable String gameCode) {
        Game game = service.findByCode(gameCode);

        if (game == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(game);
    }

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Game game) {
        Result<Game> result = service.add(game);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }

        return ErrorResponse.build(result);
    }

    @PutMapping("/{gameId}")
    public ResponseEntity<Object> update(@PathVariable int gameId, @RequestBody Game game) {
        if (gameId != game.getGameId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Result<Game> result = service.update(game);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }

        return ErrorResponse.build(result);
    }

}
