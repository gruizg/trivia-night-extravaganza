package learn.trivia.data.mappers;

import learn.trivia.models.Team;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TeamMapper implements RowMapper<Team> {

    @Override
    public Team mapRow(ResultSet rs, int rowNum) throws SQLException {

        Team team = new Team();

        team.setTeamId(rs.getInt("team_id"));
        team.setTeamToken(rs.getString("team_token"));
        team.setTeamNumber(rs.getInt("team_number"));
        team.setTeamName(rs.getString("team_name"));
        team.setGame(new GameMapper().mapRow(rs, rowNum));

        return team;
    }

}
