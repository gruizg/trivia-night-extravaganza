package learn.trivia.data.doubles;

import learn.trivia.data.QuestionRepository;
import learn.trivia.models.Question;

import java.util.ArrayList;
import java.util.List;

public class QuestionRepositoryDouble implements QuestionRepository {

    ArrayList<Question> questions = new ArrayList<>();

    public QuestionRepositoryDouble() {
    }

    @Override
    public Question findById(int questionId) {
        return null;
    }

    @Override
    public List<Question> findByThemeId(int themeId) {
        return List.of();
    }

    //TODO: IMPLEMENT DOUBLE

}