package learn.trivia.controllers;

import learn.trivia.domain.ThemeService;
import learn.trivia.models.Question;
import learn.trivia.models.Response;
import learn.trivia.models.Theme;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/theme")
public class ThemeController {

    private final ThemeService service;

    public ThemeController(ThemeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Theme> findAllThemes() { return service.findAllThemes(); }

    @GetMapping("/{themeId}")
    public ResponseEntity<Theme> findThemeById(@PathVariable int themeId) {
        Theme theme = service.findThemeById(themeId);

        if (theme == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(theme);
    }

    @GetMapping("/question/all/{themeId}")
    public List<Question> findQuestionsByTheme(@PathVariable int themeId) { return service.findQuestionsByThemeId(themeId); }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<Question> findQuestionById(@PathVariable int questionId) {
        Question question = service.findQuestionById(questionId);

        if (question == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(question);
    }
    //TODO: IMPLEMENT

}
