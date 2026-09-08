package learn.trivia.data.mappers;

import learn.trivia.models.Response;
import learn.trivia.models.ResponseStatus;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ResponseMapper implements RowMapper<Response> {

    private final TeamMapper teamMapper = new TeamMapper();
    private final QuestionMapper questionMapper = new QuestionMapper();

    @Override
    public Response mapRow(ResultSet rs, int rowNum) throws SQLException {

        Response response = new Response();

        response.setResponseId(rs.getInt("response_id"));
        response.setResponseAnswer(rs.getString("response_answer"));
        response.setResponseWager(rs.getInt("response_wager"));
        response.setResponseStatus(ResponseStatus.findByName(rs.getString("response_status")));
        response.setResponsePoints(rs.getInt("response_points"));
        response.setTeam(teamMapper.mapRow(rs, rowNum));
        response.setQuestion(questionMapper.mapRow(rs, rowNum));

        return response;
    }

}