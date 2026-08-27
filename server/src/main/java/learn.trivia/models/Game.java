package learn.trivia.models;

import java.util.Objects;

public class Game {

    private int gameId;
    private String gameCode;
    private String hostToken;
    private String gameStatus;
    private int currentRound;
    private Question currentQuestion;
    private Theme theme;

    public Game() {}

    public Game(int gameId, String gameCode, String hostToken, String gameStatus, int currentRound, Question currentQuestion, Theme theme) {
        this.gameId = gameId;
        this.gameCode = gameCode;
        this.hostToken = hostToken;
        this.gameStatus = gameStatus;
        this.currentRound = currentRound;
        this.currentQuestion = currentQuestion;
        this.theme = theme;
    }

    public int getGameId() {
        return gameId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    public String getGameCode() {
        return gameCode;
    }

    public void setGameCode(String gameCode) {
        this.gameCode = gameCode;
    }

    public String getHostToken() {
        return hostToken;
    }

    public void setHostToken(String hostToken) {
        this.hostToken = hostToken;
    }

    public String getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(String gameStatus) {
        this.gameStatus = gameStatus;
    }

    public int getCurrentRound() {
        return currentRound;
    }

    public void setCurrentRound(int currentRound) {
        this.currentRound = currentRound;
    }

    public Question getCurrentQuestion() {
        return currentQuestion;
    }

    public void setCurrentQuestion(Question currentQuestion) {
        this.currentQuestion = currentQuestion;
    }

    public Theme getTheme() {
        return theme;
    }

    public void setTheme(Theme theme) {
        this.theme = theme;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Game game = (Game) o;
        return gameId == game.gameId && currentRound == game.currentRound && Objects.equals(gameCode, game.gameCode) && Objects.equals(hostToken, game.hostToken) && Objects.equals(gameStatus, game.gameStatus) && Objects.equals(currentQuestion, game.currentQuestion) && Objects.equals(theme, game.theme);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gameId, gameCode, hostToken, gameStatus, currentRound, currentQuestion, theme);
    }

}
