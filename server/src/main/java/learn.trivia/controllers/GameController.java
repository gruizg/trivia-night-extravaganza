package learn.trivia.controllers;

import learn.trivia.domain.GameService;
import learn.trivia.domain.Result;
import learn.trivia.models.Game;
import learn.trivia.sse.GameEventBroadcaster;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService service;
    private final GameEventBroadcaster broadcaster;

    public GameController(GameService service, GameEventBroadcaster broadcaster) {
        this.service = service;
        this.broadcaster = broadcaster;
    }

    // Frontend clients open this once per game and receive "game", "team",
    // and "response" events pushed from the services below instead of
    // polling the endpoints on a timer.
    @GetMapping(value = "/{gameId}/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable int gameId) {
        return broadcaster.subscribe(gameId);
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