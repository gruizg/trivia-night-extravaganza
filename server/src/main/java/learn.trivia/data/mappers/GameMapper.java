package learn.trivia.data.mappers;

import learn.trivia.models.Game;
import learn.trivia.models.GameStatus;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class GameMapper implements RowMapper<Game> {

    @Override
    public Game mapRow(ResultSet rs, int rowNum) throws SQLException {

        Game game = new Game();

        game.setGameId(rs.getInt("game_id"));
        game.setGameCode(rs.getString("game_code"));
        game.setHostToken(rs.getString("host_token"));
        game.setGameStatus(GameStatus.valueOf(rs.getString("game_status")));
        game.setCurrentRound(rs.getInt("current_round"));
        int currentQuestionId = rs.getInt("current_question_id");
        if (!rs.wasNull()) {
            game.setCurrentQuestion(new QuestionMapper().mapRow(rs, rowNum));
        } else {
            game.setCurrentQuestion(null);
        }
        game.setTheme(new ThemeMapper().mapRow(rs, rowNum));

        return game;
    }

    //TODO: IMPLEMENT

}
