package learn.trivia.data;

import learn.trivia.data.mappers.ResponseMapper;
import learn.trivia.models.Response;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ResponseJdbcClientRepository implements ResponseRepository {

    private final JdbcClient client;

    public ResponseJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }

    private final String SELECT = """
                select r.response_id, r.response_answer, r.response_wager, r.response_correct, r.response_points,
                       t.team_id, t.team_token, t.team_number, t.team_name,
                       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
                       g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
                       th.theme_id, th.theme_title, th.theme_description,
                       u.user_id, u.username, u.email, u.password
            
                from response r
                    left join team t on r.team_id = t.team_id
                    left join question q on r.question_id = q.question_id
                    left join game g on t.game_id = g.game_id
                    left join theme th on g.theme_id = th.theme_id
                    left join user u on th.user_id = u.user_id
            """;

    @Override
    public Response findById(int responseId) {
        final String sql = SELECT + "where r.response_id = ?;";

        return client.sql(sql)
                .param(responseId)
                .query(new ResponseMapper())
                .optional().orElse(null);
    }

    @Override
    public List<Response> findByQuestionKey(int gameId, int questionId) {
        final String sql = SELECT + "where g.game_id = ? and q.question_id = ?;";

        return client.sql(sql)
                .param(gameId)
                .param(questionId)
                .query(new ResponseMapper())
                .list();
    }

    @Override
    public List<Response> findByTeam(int teamId) {
        final String sql = SELECT + "where t.team_id = ?;";

        return client.sql(sql)
                .param(teamId)
                .query(new ResponseMapper())
                .list();
    }

    @Override
    public int findScoreByTeam(int teamId) {
        final String sql = """
                select coalesce(sum(response.response_points), 0)
                from response
                where team_id = ?;
                """;

        return client.sql(sql)
                .param(teamId)
                .query(Integer.class)
                .single();
    }

    @Override
    public Response add(Response response) {
        final String sql = """
                insert into response(response_answer, response_wager, response_correct, response_points, team_id, question_id)
                    values (:response_answer, :response_wager, :response_correct, :response_points, :team_id, :question_id);
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = client.sql(sql)
                .param("response_answer", response.getResponseAnswer())
                .param("response_wager", response.getResponseWager())
                .param("response_correct", response.isResponseCorrect())
                .param("response_points", response.getResponsePoints())
                .param("team_id", response.getTeam().getTeamId())
                .param("question_id", response.getQuestion().getQuestionId())
                .update(keyHolder, "response_id");

        if (rowsAffected == 0) return null;

        response.setResponseId(keyHolder.getKey().intValue());
        return findById(response.getResponseId());
    }

    @Override
    public boolean update(Response response) {
        final String sql = """
                update response
                set response_correct = ?,
                    response_points = ?
                where response_id = ?;
                """;

        return client.sql(sql)
                .param(response.isResponseCorrect())
                .param(response.getResponsePoints())
                .param(response.getResponseId())
                .update() > 0;
    }

    @Override
    public List<Integer> findAvailableWagers(int teamId, int currentRound) {
        final String sql = """
                select r.response_wager from response r
                left join team t on r.team_id = t.team_id
                left join question q on r.question_id = q.question_id
                left join game g on t.game_id = g.game_id
                where t.team_id = ? and q.question_round = ?;
                """;

        List<Integer> usedWagers = client.sql(sql)
                .param(teamId)
                .param(currentRound)
                .query(Integer.class)
                .list();

        List<Integer> remainingWages = new java.util.ArrayList<>(List.of(1, 3, 5));
        remainingWages.removeAll(usedWagers);

        return remainingWages;
    }

}