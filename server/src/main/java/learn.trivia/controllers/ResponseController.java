package learn.trivia.controllers;

import learn.trivia.domain.ResponseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/response")
public class ResponseController {

    private final ResponseService service;

    public ResponseController(ResponseService service) {
        this.service = service;
    }

    @GetMapping
    //TODO: IMPLEMENT
}
