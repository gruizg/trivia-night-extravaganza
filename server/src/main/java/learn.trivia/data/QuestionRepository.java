package learn.trivia.data;

import learn.trivia.models.Question;

import java.util.List;

public interface QuestionRepository {

    Question findById(int questionId);

    List<Question> findByThemeId(int themeId);

    //TODO: IMPLEMENT

}
