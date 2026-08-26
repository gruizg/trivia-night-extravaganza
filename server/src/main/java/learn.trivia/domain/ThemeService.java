package learn.trivia.domain;

import learn.trivia.data.QuestionRepository;
import learn.trivia.data.ThemeRepository;
import org.springframework.stereotype.Service;

@Service
public class ThemeService {

    private final ThemeRepository themeRepository;
    private final QuestionRepository questionRepository;

    public ThemeService(ThemeRepository themeRepository, QuestionRepository questionRepository) {
        this.themeRepository = themeRepository;
        this.questionRepository = questionRepository;
    }

    //TODO: IMPLEMENT

}
