package learn.trivia.data.mappers;

import learn.trivia.models.Theme;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ThemeMapper implements RowMapper<Theme> {

    private final UserMapper userMapper = new UserMapper();

    @Override
    public Theme mapRow(ResultSet rs, int rowNum) throws SQLException {

        Theme theme = new Theme();

        theme.setThemeId(rs.getInt("theme_id"));
        theme.setThemeTitle(rs.getString("theme_title"));
        theme.setThemeDescription(rs.getString("theme_description"));
        int userId = rs.getInt("user_id");
        if (!rs.wasNull()){
            theme.setUser(userMapper.mapRow(rs, rowNum));
        } else {
            theme.setUser(null);
        }

        return theme;
    }

}