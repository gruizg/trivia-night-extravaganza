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
        <div className="flex h-full min-h-0 flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Amend Answer Requests
            </h2>

            {(!requests || requests.length === 0) ? (
                <p className="text-sm text-gray-400">
                    No requests to amend an answer right now.
                </p>
            ) : (
                <ul className="flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto">
                    {requests.map((request) => (
                        <li
                            key={request.responseId}
                            className="rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-800"
                        >
                            <p className="font-semibold text-gray-500 dark:text-gray-400">
                                Team {request.team?.teamNumber ?? "?"}
                                {request.team?.teamName ? ` · ${request.team.teamName}` : ""}
                            </p>

                            <p className="mt-2 font-medium text-gray-900 dark:text-white">
                                {resolvePrompt(request, questions)}
                            </p>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                Their answer: <span className="font-medium">{request.responseAnswer}</span>
                            </p>

                            {request.responseAmendReason && (
                                <p className="mt-2 rounded bg-gray-50 p-2 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    "{request.responseAmendReason}"
                                </p>
                            )}

                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => onResolve(request, true)}
                                    className="rounded bg-green-100 px-3 py-1 text-sm font-bold text-green-700 hover:bg-green-200"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => onResolve(request, false)}
                                    className="rounded bg-red-100 px-3 py-1 text-sm font-bold text-red-700 hover:bg-red-200"
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
