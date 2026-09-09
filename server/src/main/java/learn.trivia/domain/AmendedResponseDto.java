package learn.trivia.domain;

import learn.trivia.models.Response;

// Result payload for ResponseService.requestAmend (surfaced by
// PUT /api/response/{id}/amend and the matching SSE "response" broadcast).
//
// The underlying Response entity only ever has its responseStatus flipped
// to AMEND so the frontend can key off it - it never carries the team's
// free-text reason. This DTO wraps that otherwise-unmodified entity
// together with the reason, so the host still receives the message on the
// one live broadcast/response exactly as before, without the entity itself
// gaining a field to hold it.
public record AmendedResponseDto(Response response, String responseAmendReason) {
}
