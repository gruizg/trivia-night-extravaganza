package learn.trivia.domain;

import learn.trivia.data.QuestionRepository;
import learn.trivia.data.ThemeRepository;
import learn.trivia.models.Question;
import learn.trivia.models.Theme;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThemeService {

    private final ThemeRepository themeRepository;
    private final QuestionRepository questionRepository;

    public ThemeService(ThemeRepository themeRepository, QuestionRepository questionRepository) {
        this.themeRepository = themeRepository;
        this.questionRepository = questionRepository;
    }

    public Theme findThemeById(int themeId) {
        return themeRepository.findById(themeId);
    }
    public List<Theme> findAllThemes() {
        return themeRepository.findAll();
    }

    public Question findQuestionById(int questionId) {
        return questionRepository.findById(questionId);
    }

    public List<Question> findQuestionsByThemeId(int themeId) {
        return questionRepository.findByThemeId(themeId);
    }

}
