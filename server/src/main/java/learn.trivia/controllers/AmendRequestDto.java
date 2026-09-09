package learn.trivia.controllers;

// Request body for PUT /api/response/{id}/amend. The reason is deliberately
// never persisted (see ResponseService.requestAmend / ResponseJdbcClientRepository)
// - it exists only long enough to ride the one SSE broadcast out to the
// host, who is meant to see it live and decide, not read it back later.
public record AmendRequestDto(String responseAmendReason) {
}
