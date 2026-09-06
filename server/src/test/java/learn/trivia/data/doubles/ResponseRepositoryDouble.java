package learn.trivia.data.doubles;

import learn.trivia.data.ResponseRepository;
import learn.trivia.models.Question;
import learn.trivia.models.QuestionType;
import learn.trivia.models.Response;
import learn.trivia.models.Team;

import java.util.ArrayList;
import java.util.List;

import static learn.trivia.TestDataHelpers.Models.*;

public class ResponseRepositoryDouble implements ResponseRepository {

    ArrayList<Response> responses = new ArrayList<>();

    public ResponseRepositoryDouble() {
        responses.add(makeExistingResponse());
        Team team = new Team(2, "token 2", 2, "name 2", makeExistingGame());
        responses.add(new Response(2,"answer 2", 3, true, 3, team, makeExistingQuestion()));
        Question question = new Question  (2, "Category 2", "Question 2", "Answer 2", QuestionType.NORMAL, 1, 2, makeExistingTheme());
        responses.add(new Response(3, "answer", 3, false, 0, makeExistingTeam(), question));
        Question question4 = new Question  (2, "Category 2", "Question 2", "Answer 2", QuestionType.NORMAL, 2, 1, makeExistingTheme());
        responses.add(new Response(4, "answer", 5, true, 5, makeExistingTeam(), question4));
    }

    @Override
    public Response findById(int responseId) {

        return responses.stream().filter(response -> response.getResponseId() == responseId).findFirst().orElse(null);
    }

    @Override
    public List<Response> findByQuestionKey(int gameId, int questionId) {

        return responses.stream().filter(response -> response.getQuestion().getQuestionId() == questionId && response.getTeam().getGame().getGameId() == gameId).toList();
    }

    @Override
    public List<Response> findByTeam(int teamId) {

        return responses.stream().filter(response -> response.getTeam().getTeamId() == teamId).toList();
    }

    @Override
    public int findScoreByTeam(int teamId) {

        return responses.stream().filter(response -> response.getTeam().getTeamId() == teamId).mapToInt(Response::getResponsePoints).sum();
    }

    @Override
    public Response add(Response response) {
        response.setResponseId(5);
        return response;
    }

    @Override
    public boolean update(Response response) {
        responses.set(0, response);
        return response.getResponseId() == 1;
    }

    @Override
    public List<Integer> findAvailableWagers(int teamId, int currentRound) {

        List<Integer> usedWages = responses.stream().filter(response -> response.getTeam().getTeamId() == teamId).filter(response -> response.getQuestion().getQuestionRound() == currentRound).map(Response::getResponseWager).toList();
        List<Integer> wages = new ArrayList<>(List.of(1,3,5));

        return wages.stream().filter(wager -> !usedWages.contains(wager)).toList();
    }

    //TODO: IMPLEMENT DOUBLE

}