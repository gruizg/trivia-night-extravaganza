package learn.trivia.controllers;

import learn.trivia.domain.AmendedResponseDto;
import learn.trivia.domain.ResponseService;
import learn.trivia.domain.Result;
import learn.trivia.models.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/response")
public class ResponseController {

    private final ResponseService service;

    public ResponseController(ResponseService service) {
        this.service = service;
    }

    @GetMapping("/{responseId}")
    public ResponseEntity<Response> findById(@PathVariable int responseId) {
        Response response = service.findById(responseId);

        if (response == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/question/{gameId}/{questionId}")
    public List<Response> findByQuestion(@PathVariable int gameId, @PathVariable int questionId) {
        return service.findByQuestion(gameId, questionId);
    }

    @GetMapping("/team/{teamId}")
    public List<Response> findByTeam(@PathVariable int teamId) {
        return service.findByTeam(teamId);
    }

    @GetMapping("/wagers/{teamId}/{currentRound}")
    public List<Integer> findAvailableWagers(@PathVariable int teamId, @PathVariable int currentRound) {
        return service.findAvailableWagers(teamId, currentRound);
    }

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Response response) {
        Result<Response> result = service.add(response);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody Response response) {
        if (id != response.getResponseId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Result<Response> result = service.update(response);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return ErrorResponse.build(result);
    }

    @PutMapping("/{id}/amend")
    public ResponseEntity<Object> requestAmend(@PathVariable int id, @RequestBody AmendRequestDto dto) {
        Result<AmendedResponseDto> result = service.requestAmend(id, dto.responseAmendReason());
        if (result.isSuccess()) {
            return ResponseEntity.ok(result.getPayload());
        }

        return ErrorResponse.build(result);
    }

}

