package learn.trivia.data.mappers;

import learn.trivia.models.Question;
import learn.trivia.models.QuestionType;
import learn.trivia.models.Response;
import learn.trivia.models.ResponseStatus;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ResponseMapper implements RowMapper<Response> {

    private final TeamMapper teamMapper = new TeamMapper();
    private final ThemeMapper themeMapper = new ThemeMapper();

    @Override
    public Response mapRow(ResultSet rs, int rowNum) throws SQLException {

        Response response = new Response();

        response.setResponseId(rs.getInt("response_id"));
        response.setResponseAnswer(rs.getString("response_answer"));
        response.setResponseWager(rs.getInt("response_wager"));
        response.setResponseStatus(ResponseStatus.findByName(rs.getString("response_status")));
        response.setResponsePoints(rs.getInt("response_points"));
        response.setTeam(teamMapper.mapRow(rs, rowNum));
        response.setQuestion(mapResponseQuestion(rs, rowNum));

        return response;
    }

    // The response's own question is joined (and column-aliased rq_*)
    // separately from the game's current question, since a response can be
    // for any past question, not just the one the game is currently on.
    // TeamMapper -> GameMapper reads the unaliased question_id/etc columns
    // for game.currentQuestion, so this reads the rq_* columns directly
    // rather than delegating to QuestionMapper, which expects those
    // unaliased names.
    private Question mapResponseQuestion(ResultSet rs, int rowNum) throws SQLException {
        Question question = new Question();

        question.setQuestionId(rs.getInt("rq_question_id"));
        question.setQuestionCategory(rs.getString("rq_question_category"));
        question.setQuestionPrompt(rs.getString("rq_question_prompt"));
        question.setQuestionAnswer(rs.getString("rq_question_answer"));
        question.setQuestionType(QuestionType.findByName(rs.getString("rq_question_type")));
        question.setQuestionRound(rs.getInt("rq_question_round"));
        question.setQuestionOrder(rs.getInt("rq_question_order"));
        question.setTheme(themeMapper.mapRow(rs, rowNum));

        return question;
    }

}
