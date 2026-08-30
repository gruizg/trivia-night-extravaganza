package learn.trivia.data.mappers;

import learn.trivia.models.Question;
import learn.trivia.models.QuestionType;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class QuestionMapper implements RowMapper<Question> {

    @Override
    public Question mapRow(ResultSet rs, int rowNum) throws SQLException {

        Question question = new Question();

        question.setQuestionId(rs.getInt("question_id"));
        question.setQuestionCategory(rs.getString("question_category"));
        question.setQuestionPrompt(rs.getString("question_prompt"));
        question.setQuestionAnswer(rs.getString("question_answer"));
        question.setQuestionType(QuestionType.valueOf(rs.getString("question_type")));
        question.setQuestionRound(rs.getInt("question_round"));
        question.setQuestionOrder(rs.getInt("question_order"));
        question.setTheme(new ThemeMapper().mapRow(rs, rowNum));

        return question;
    }

}