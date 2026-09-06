package learn.trivia.data;

import learn.trivia.data.mappers.GameMapper;
import learn.trivia.models.Game;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class GameJdbcClientRepository implements GameRepository {

    private final JdbcClient client;

    public GameJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }

    @Override
    public Game findById(int gameId) {

        final String sql = """
                select g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
                       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
                       th.theme_id, th.theme_title, th.theme_description,
                       u.user_id, u.username, u.email, u.password
                
                from game g
                    left join theme th on g.theme_id = th.theme_id
                    left join question q on g.current_question_id = q.question_id and th.theme_id = q.theme_id
                    left join user u on th.user_id = u.user_id
                where g.game_id = ?;
                """;
        return client.sql(sql)
                .param(gameId)
                .query(new GameMapper())
                .optional().orElse(null);
    }

    @Override
    public Game findByCode(String gameCode) {

        final String sql = """
                select g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
                       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
                       th.theme_id, th.theme_title, th.theme_description,
                       u.user_id, u.username, u.email, u.password
                
                from game g
                         left join theme th on g.theme_id = th.theme_id
                         left join question q on g.current_question_id = q.question_id and th.theme_id = q.theme_id
                         left join user u on th.user_id = u.user_id
                where g.game_code = ?;
                """;
        return client.sql(sql)
                .param(gameCode)
                .query(new GameMapper())
                .optional().orElse(null);
    }

    @Override
    public Game add(Game game) {

        final String sql = """
                INSERT INTO game(game_code, host_token, game_status, theme_id)
                    values (:game_code, :host_token, :game_status, :theme_id);
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = client.sql(sql)
                .param("game_code", game.getGameCode())
                .param("host_token", game.getHostToken())
                .param("game_status", game.getGameStatus().getName())
                .param("theme_id", game.getTheme().getThemeId())
                .update(keyHolder, "game_id");

        if (rowsAffected == 0) return null;

        game.setGameId(keyHolder.getKey().intValue());
        return game;
    }

    @Override
    public boolean update(Game game) {

        final String sql = """
                update game set
                                game_status = ?,
                                current_round = ?,
                                current_question_id = ?
                where game_id = ?;
                """;

        Integer questionId = game.getCurrentQuestion() != null ? game.getCurrentQuestion().getQuestionId() : null;

        return client.sql(sql)
                .param(game.getGameStatus().name())
                .param(game.getCurrentRound())
                .param(questionId)
                .param(game.getGameId())
                .update() > 0;
    }

    @Override
    public boolean gameCodeExists(String code) {

        final String sql = "select exists(select 1 from game where game_code = ?);";


        return client.sql(sql)
                .param(code)
                .query(Boolean.class)
                .single();
    }

}
