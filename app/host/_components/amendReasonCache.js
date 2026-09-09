// Amendment reasons are never persisted by the backend (see
// ResponseService.requestAmend on the server) - the host only ever gets one
// live SSE push containing the text. This caches that text in the browser
// only, scoped per game, so a host who reloads the page or reopens the tab
// doesn't lose reasons that already arrived - without the backend storing
// them anywhere permanent.

const STORAGE_PREFIX = "trivia:amend-reasons:";

function storageKey(gameId) {
    return `${STORAGE_PREFIX}${gameId}`;
}

export function loadAmendReasons(gameId) {
    if (typeof window === "undefined" || !gameId) return {};

    try {
        const raw = window.localStorage.getItem(storageKey(gameId));
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function saveAmendReasons(gameId, reasons) {
    if (typeof window === "undefined" || !gameId) return;

    try {
        window.localStorage.setItem(storageKey(gameId), JSON.stringify(reasons));
    } catch {
        // Private browsing, storage quota, etc. - the reason just won't
        // survive a reload in that case, same as before.
    }
}
