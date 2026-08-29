package learn.trivia.models;

import java.util.Objects;

public class Team {

    private int teamId;
    private String teamToken;
    private int teamNumber;
    private String teamName;
    private Game game;

    public Team() {}

    public Team(int teamId, String teamToken, int teamNumber, String teamName, Game game) {
        this.teamId = teamId;
        this.teamToken = teamToken;
        this.teamNumber = teamNumber;
        this.teamName = teamName;
        this.game = game;
    }

    public int getTeamId() {
        return teamId;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }

    public String getTeamToken() {
        return teamToken;
    }

    public void setTeamToken(String teamToken) {
        this.teamToken = teamToken;
    }

    public int getTeamNumber() {
        return teamNumber;
    }

    public void setTeamNumber(int teamNumber) {
        this.teamNumber = teamNumber;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Team team = (Team) o;
        return teamId == team.teamId && Objects.equals(teamToken, team.teamToken) && Objects.equals(teamNumber, team.teamNumber) && Objects.equals(teamName, team.teamName) && Objects.equals(game, team.game);
    }

    @Override
    public int hashCode() {
        return Objects.hash(teamId, teamToken, teamNumber, teamName, game);
    }

}
