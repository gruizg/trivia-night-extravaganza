package learn.trivia.data.mappers;

import learn.trivia.models.Game;
import learn.trivia.models.GameStatus;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class GameMapper implements RowMapper<Game> {

    private final QuestionMapper questionMapper = new QuestionMapper();
    private final ThemeMapper themeMapper = new ThemeMapper();

    @Override
    public Game mapRow(ResultSet rs, int rowNum) throws SQLException {

        Game game = new Game();

        game.setGameId(rs.getInt("game_id"));
        game.setGameCode(rs.getString("game_code"));
        game.setHostToken(rs.getString("host_token"));
        game.setGameStatus(GameStatus.findByName(rs.getString("game_status")));
        int currentRound = rs.getInt("current_round");
        if (rs.wasNull()) {
            game.setCurrentRound(0);
        } else {
            game.setCurrentRound(currentRound);
        }
        if (rs.getObject("current_question_id") != null) {
            game.setCurrentQuestion(questionMapper.mapRow(rs, rowNum));
        } else {
            game.setCurrentQuestion(null);
        }
        game.setTheme(themeMapper.mapRow(rs, rowNum));

        return game;
    }

}