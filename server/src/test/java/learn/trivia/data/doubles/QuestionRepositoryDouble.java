package learn.trivia.data.doubles;

import learn.trivia.data.QuestionRepository;
import learn.trivia.models.Question;
import learn.trivia.models.QuestionType;
import learn.trivia.models.Theme;

import java.util.ArrayList;
import java.util.List;

import static learn.trivia.TestDataHelpers.Models.*;

public class QuestionRepositoryDouble implements QuestionRepository {

    ArrayList<Question> questions = new ArrayList<>();

    public QuestionRepositoryDouble() {
        questions.add(makeQuestion());
        questions.add(new Question(2, "category 2", "question 2", "answer 2", QuestionType.NORMAL, 1, 2, makeTheme()));
        Theme theme = new Theme(2, "theme 2", "description 2", makeUser());
        questions.add(new Question(3, "category 3", "question 3", "answer 3", QuestionType.HALFTIME, 1, 1, theme));

    }

    @Override
    public Question findById(int questionId) {
        return questions.stream().filter(question -> question.getQuestionId() == questionId).findFirst().orElse(null);
    }

    @Override
    public List<Question> findByThemeId(int themeId) {
        return questions.stream().filter(question -> question.getTheme().getThemeId() == themeId).toList();
    }

    //TODO: IMPLEMENT DOUBLE

}