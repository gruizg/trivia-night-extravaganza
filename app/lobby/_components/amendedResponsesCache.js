// Teams should only be able to request an amendment once per response.
// The backend has no field that distinguishes "the host denied this" from
// "never requested" - resolving a request just sets responseStatus back to
// INCORRECT (see HostGame.resolveAmendRequest), the same status a response
// starts with. So the frontend has to remember locally which responses
// this team has already sent an amend request for, or a denied request
// would look identical to a fresh INCORRECT response and the "Request
// Amendment" button would reappear. Scoped per team so it survives a page
// reload but doesn't leak across different teams sharing a browser.

const STORAGE_PREFIX = "trivia:amended-responses:";

function storageKey(teamId) {
    return `${STORAGE_PREFIX}${teamId}`;
}

export function loadAmendedResponses(teamId) {
    if (typeof window === "undefined" || !teamId) return [];

    try {
        const raw = window.localStorage.getItem(storageKey(teamId));
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function markResponseAmended(teamId, responseId) {
    if (typeof window === "undefined" || !teamId) return;

    try {
        const existing = loadAmendedResponses(teamId);
        if (existing.includes(responseId)) return;
        window.localStorage.setItem(
            storageKey(teamId),
            JSON.stringify([...existing, responseId])
        );
    } catch {
        // Private browsing, storage quota, etc. - worst case the button
        // could reappear after a reload, same risk as before this cache.
    }
}
