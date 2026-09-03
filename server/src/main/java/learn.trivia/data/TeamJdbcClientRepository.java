package learn.trivia.data;

import learn.trivia.data.mappers.TeamMapper;
import learn.trivia.models.Team;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TeamJdbcClientRepository implements TeamRepository {

    private final JdbcClient client;

    public TeamJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }

    @Override
    public Team findById(int teamId) {

        final String sql = """
                select t.team_id, t.team_token, t.team_number, t.team_name,
                       g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
                       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
                       th.theme_id, th.theme_title, th.theme_description,
                       u.user_id, u.username, u.email, u.password
                
                from team t
                left join game g on t.game_id = g.game_id
                left join theme th on g.theme_id = th.theme_id
                left join question q on g.current_question_id = q.question_id and th.theme_id = q.theme_id
                left join user u on th.user_id = u.user_id
                where t.team_id = ?;
                """;

        return client.sql(sql)
                .param(teamId)
                .query(new TeamMapper())
                .optional().orElse(null);
    }

    @Override
    public List<Team> findAll() {

        final String sql = """
                select t.team_id, t.team_token, t.team_number, t.team_name,
                       g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
                       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
                       th.theme_id, th.theme_title, th.theme_description,
                       u.user_id, u.username, u.email, u.password
                
                from team t
                left join game g on t.game_id = g.game_id
                left join theme th on g.theme_id = th.theme_id
                left join question q on g.current_question_id = q.question_id and th.theme_id = q.theme_id
                left join user u on th.user_id = u.user_id
                """;

        return client.sql(sql)
                .query(new TeamMapper())
                .list();
    }

    @Override
    public Team add(Team team) {

        final String sql = """
                insert into team(team_token, team_number, team_name, game_id)
                values (:team_token, :team_number, :team_name, :game_id);
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = client.sql(sql)
                .param("team_token", team.getTeamToken())
                .param("team_number", team.getTeamNumber())
                .param("team_name", team.getTeamName())
                .param("game_id", team.getGame().getGameId())
                .update(keyHolder, "team_id");

        if (rowsAffected == 0) return null;

        team.setTeamId(keyHolder.getKey().intValue());
        return team;
    }

}