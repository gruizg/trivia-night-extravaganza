"use client"

// Resolves the question prompt for a request. Amendment requests can be
// for any past question (not just the current one on screen), so this
// falls back to the theme's full question list - loaded once by HostGame -
// when the response itself doesn't already carry the prompt text.
function resolvePrompt(request, questions) {
    if (request.question?.questionPrompt) return request.question.questionPrompt;
    const found = questions?.find(
        (q) => String(q.questionId) === String(request.question?.questionId)
    );
    return found?.questionPrompt ?? `Question ${request.question?.questionId ?? "?"}`;
}

export default function AmendRequests({ requests, questions, onResolve }) {
    return (
        <div className="flex h-full min-h-0 flex-col card p-6">
            <h2 className="mb-4 text-lg heading">
                Amend Answer Requests
            </h2>

            {(!requests || requests.length === 0) ? (
                <p className="text-hint">
                    No requests to amend an answer right now.
                </p>
            ) : (
                <ul className="flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto">
                    {requests.map((request) => (
                        <li
                            key={request.responseId}
                            className="list-row p-4 text-sm"
                        >
                            <p className="font-semibold text-subtle">
                                Team {request.team?.teamNumber ?? "?"}
                                {request.team?.teamName ? ` · ${request.team.teamName}` : ""}
                            </p>

                            <p className="mt-2 text-emphasis">
                                {resolvePrompt(request, questions)}
                            </p>
                            <p className="mt-1 text-muted">
                                Their answer: <span className="font-medium">{request.responseAnswer}</span>
                            </p>

                            {request.responseAmendReason && (
                                <p className="mt-2 rounded bg-gray-50 p-2 text-muted dark:bg-gray-800">
                                    "{request.responseAmendReason}"
                                </p>
                            )}

                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => onResolve(request, true)}
                                    className="rounded toggle-success px-3 py-1 text-sm"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => onResolve(request, false)}
                                    className="rounded toggle-error px-3 py-1 text-sm"
                                >
                                    Deny
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
