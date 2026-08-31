package learn.trivia.models;

import java.util.Objects;

public class Response {

    private int responseId;
    private String responseAnswer;
    private int responseWager;
    private boolean responseCorrect;
    private int responsePoints;
    private Team team;
    private Question question;

    public Response() {}

    public Response(int responseId, String responseAnswer, int responseWager,
                    boolean responseCorrect, int responsePoints, Team team, Question question) {
        this.responseId = responseId;
        this.responseAnswer = responseAnswer;
        this.responseWager = responseWager;
        this.responseCorrect = responseCorrect;
        this.responsePoints = responsePoints;
        this.team = team;
        this.question = question;
    }

    public int getResponseId() {
        return responseId;
    }

    public void setResponseId(int responseId) {
        this.responseId = responseId;
    }

    public String getResponseAnswer() {
        return responseAnswer;
    }

    public void setResponseAnswer(String responseAnswer) {
        this.responseAnswer = responseAnswer;
    }

    public int getResponseWager() {
        return responseWager;
    }

    public void setResponseWager(int responseWager) {
        this.responseWager = responseWager;
    }

    public boolean isResponseCorrect() {
        return responseCorrect;
    }

    public void setResponseCorrect(boolean responseCorrect) {
        this.responseCorrect = responseCorrect;
    }

    public int getResponsePoints() {
        return responsePoints;
    }

    public void setResponsePoints(int responsePoints) {
        this.responsePoints = responsePoints;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Response response = (Response) o;
        return responseId == response.responseId && responseWager == response.responseWager && responseCorrect == response.responseCorrect && responsePoints == response.responsePoints && Objects.equals(responseAnswer, response.responseAnswer) && Objects.equals(team, response.team) && Objects.equals(question, response.question);
    }

    @Override
    public int hashCode() {
        return Objects.hash(responseId, responseAnswer, responseWager, responseCorrect, responsePoints, team, question);
    }

}
