package learn.trivia.models;

import java.util.Objects;

public class Response {

    private int responseId;
    private String responseAnswer;
    private int responseWager = 0;
    private ResponseStatus responseStatus = ResponseStatus.PENDING;
    private int responsePoints = 0;
    private Team team;
    private Question question;

    public Response() {}

    public Response(int responseId, String responseAnswer, int responseWager, ResponseStatus responseStatus, int responsePoints, Team team, Question question) {
        this.responseId = responseId;
        this.responseAnswer = responseAnswer;
        this.responseWager = responseWager;
        this.responseStatus = responseStatus;
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

    public ResponseStatus getResponseStatus() {
        return responseStatus;
    }

    public void setResponseStatus(ResponseStatus responseStatus) {
        this.responseStatus = responseStatus;
        this.responsePoints = (responseStatus == ResponseStatus.CORRECT) ? this.responseWager : 0;
    }

    public boolean isGraded() {
        return responseStatus != ResponseStatus.PENDING;
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
        return responseId == response.responseId && responseWager == response.responseWager && responsePoints == response.responsePoints && Objects.equals(responseAnswer, response.responseAnswer) && responseStatus == response.responseStatus && Objects.equals(team, response.team) && Objects.equals(question, response.question);
    }

    @Override
    public int hashCode() {
        return Objects.hash(responseId, responseAnswer, responseWager, responseStatus, responsePoints, team, question);
    }
}
