package learn.trivia.data;

import learn.trivia.models.Response;

import java.util.List;

public interface ResponseRepository {

    Response findById(int responseId);

    List<Response> findByQuestionKey(int gameId, int questionId);

    List<Response> findByTeam(int teamId);

    int findScoreByTeam(int teamId);

    Response add(Response response);

    boolean update(Response response);

    List<Integer> findAvailableWagers(int teamId, int currentRound);

}