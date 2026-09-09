package learn.trivia.domain;

import learn.trivia.data.GameRepository;
import learn.trivia.data.QuestionRepository;
import learn.trivia.data.ResponseRepository;
import learn.trivia.data.TeamRepository;
import learn.trivia.models.*;
import learn.trivia.sse.GameEventBroadcaster;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResponseService {

    private final ResponseRepository responseRepository;
    private final TeamRepository teamRepository;
    private final QuestionRepository questionRepository;
    private final GameRepository gameRepository;
    private final GameEventBroadcaster broadcaster;

    public ResponseService(ResponseRepository responseRepository, TeamRepository teamRepository, QuestionRepository questionRepository, GameRepository gameRepository, GameEventBroadcaster broadcaster) {
        this.responseRepository = responseRepository;
        this.teamRepository = teamRepository;
        this.questionRepository = questionRepository;
        this.gameRepository = gameRepository;
        this.broadcaster = broadcaster;
    }

    public Response findById(int responseId) {
        return responseRepository.findById(responseId);
    }

    public List<Response> findByQuestion(int gameId, int questionId) {

        return responseRepository.findByQuestionKey(gameId, questionId);
    }

    public List<Response> findByTeam(int teamId) {
        return responseRepository.findByTeam(teamId);
    }

    public Result<Response> add(Response response) {

        Result<Response> result = new Result<>();

        if (response == null) {
            result.addMessage("No values to `add`", ResultType.INVALID);
            return result;
        }

        if (response.getTeam() == null) {
            result.addMessage("Team is required", ResultType.INVALID);
            return result;
        }

        if (response.getQuestion() == null) {
            result.addMessage("Question is required", ResultType.INVALID);
            return result;
        }

        if (response.getResponseId() != 0) {
            result.addMessage("Response id cannot be set for `add` operation", ResultType.INVALID);
        }

        if (response.getResponseStatus() != ResponseStatus.PENDING) {
            result.addMessage("Response status cannot be set for `add` operation", ResultType.INVALID);
        }

        if (response.getResponsePoints() != 0) {
            result.addMessage("Response points cannot be set for `add` operation", ResultType.INVALID);
        }

        if (response.getResponseAnswer() == null || response.getResponseAnswer().isBlank()) {
            result.addMessage("Response answer is required", ResultType.INVALID);
        }

        if (response.getTeam().getTeamId() <= 0) {
            result.addMessage("Team is invalid", ResultType.INVALID);
        }

        if (response.getQuestion().getQuestionId() <= 0) {
            result.addMessage("Question is invalid", ResultType.INVALID);
        }

        if (response.getResponseWager() < 0) {
            result.addMessage("Wager cannot be negative", ResultType.INVALID);
        }

        if (!result.isSuccess()) {
            return result;
        }

        Team existingTeam = teamRepository.findById(response.getTeam().getTeamId());

        if (existingTeam == null) {
            result.addMessage("Team not found", ResultType.NOT_FOUND);
            return result;
        }

        Question question = questionRepository.findById(response.getQuestion().getQuestionId());
        QuestionType questionType = question.getQuestionType();

        if (questionType == QuestionType.FINAL) {
            if (response.getResponseWager() < 0 || response.getResponseWager() > 15) {
                result.addMessage("Wager must be between 0 and 15", ResultType.INVALID);
            }
        }
        else if (questionType == QuestionType.HALFTIME) {
            if (response.getResponseWager() != 0) {
                result.addMessage("No wagers for halftime", ResultType.INVALID);
            }

        } else {
            List<Integer> availableWagers = responseRepository.findAvailableWagers(
                    existingTeam.getTeamId(), response.getQuestion().getQuestionRound());

            if (!availableWagers.contains(response.getResponseWager())) {
                result.addMessage("Wager is not available for this round", ResultType.INVALID);
            }
        }

        if (!result.isSuccess()) {
            return result;
        }


        Game existingGame = gameRepository.findById(existingTeam.getGame().getGameId());

        if (existingGame.getGameStatus() != GameStatus.QUESTION) {
            result.addMessage("Submissions not accepted at this time", ResultType.INVALID);
            return result;
        }

        response = responseRepository.add(response);
        result.setPayload(response);
        broadcaster.broadcast(response.getTeam().getGame().getGameId(), "response", response);
        return result;

    }

    // Teams can only request an amendment on a response the host has
    // already marked incorrect. This intentionally goes through its own
    // narrow method (backing the /amend DTO endpoint) rather than the
    // general-purpose `update`, so a team can never smuggle a status,
    // points, or answer change in alongside their reason text.
    public Result<AmendedResponseDto> requestAmend(int responseId, String reason) {
        Result<AmendedResponseDto> result = new Result<>();

        if (reason == null || reason.isBlank()) {
            result.addMessage("A reason is required to request an amendment", ResultType.INVALID);
            return result;
        }

        Response existing = responseRepository.findById(responseId);
        if (existing == null) {
            result.addMessage("Response not found", ResultType.NOT_FOUND);
            return result;
        }

        if (existing.getResponseStatus() != ResponseStatus.INCORRECT) {
            result.addMessage("Only a response marked incorrect can have an amendment requested", ResultType.INVALID);
            return result;
        }

        // The only change that ever touches the entity itself is the status
        // flip to AMEND, so the frontend can key off it. The reason text
        // never lands on the entity - it's carried alongside it in
        // AmendedResponseDto, which is never persisted (findById can't
        // restore it). This one in-memory DTO is the only place the reason
        // exists - it goes out on this broadcast for the host to see live,
        // and then it's gone.
        existing.setResponseStatus(ResponseStatus.AMEND);

        if (!responseRepository.update(existing)) {
            result.addMessage("Unable to request an amendment", ResultType.ERROR);
            return result;
        }

        AmendedResponseDto payload = new AmendedResponseDto(existing, reason.trim());
        result.setPayload(payload);
        broadcaster.broadcast(existing.getTeam().getGame().getGameId(), "response", payload);
        return result;
    }

    public Result<Response> update(Response response) {
        Result<Response> result = new Result<>();

        if (response == null) {
            result.addMessage("No values to update", ResultType.INVALID);
            return result;
        }

        if (response.getTeam() == null) {
            result.addMessage("Team is required for `update` operation", ResultType.INVALID);
            return result;
        }

        Team team = teamRepository.findById(response.getTeam().getTeamId());
        if (team.getGame() == null) {
            result.addMessage("Game is required for `update` operation", ResultType.INVALID);
            return result;
        }

        if (response.getQuestion() == null) {
            result.addMessage("Question is required for `update` operation", ResultType.INVALID);
            return result;
        }

        if (response.getResponseId() <= 0) {
            result.addMessage("Response id is required for `update` operation", ResultType.INVALID);
            return result;
        }

        Response existing = responseRepository.findById(response.getResponseId());

        if (existing == null) {
            result.addMessage("Response not found", ResultType.NOT_FOUND);
            return result;
        }


        if (!team.equals(existing.getTeam())) {
            result.addMessage("Team cannot be updated", ResultType.INVALID);
        }

        Question question = questionRepository.findById(response.getQuestion().getQuestionId());
        if (!question.equals(existing.getQuestion())) {
            result.addMessage("Question cannot be updated", ResultType.INVALID);
        }

        if (!response.getResponseAnswer().equals(existing.getResponseAnswer())) {
            result.addMessage("Response answer cannot be updated", ResultType.INVALID);
        }

        if (response.getResponseWager() != existing.getResponseWager()) {
            result.addMessage("Response wager cannot be updated", ResultType.INVALID);
        }

        if (!result.isSuccess()) {
            return result;
        }

        if (responseRepository.update(response)) {
            result.setPayload(response);
            Response updated = responseRepository.findById(response.getResponseId());
            broadcaster.broadcast(team.getGame().getGameId(), "response", updated);
            return result;
        }

        result.addMessage("Unable to update", ResultType.ERROR);
        return result;
    }

    public List<Integer> findAvailableWagers(int teamId, int currentRound) {
        return responseRepository.findAvailableWagers(teamId, currentRound); //TODO: IMPLEMENT
    }
}