"use client"

export default function AmendRequests({ requests }) {
    return (
        <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Amend Answer Requests
            </h2>

            {(!requests || requests.length === 0) ? (
                <p className="text-sm text-gray-400">
                    No requests to amend an answer right now.
                </p>
            ) : (
                <ul className="flex flex-col gap-3 overflow-y-auto">
                    {requests.map((req) => (
                        <li
                            key={req.id}
                            className="rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800"
                        >
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                Team {req.team?.teamId ?? "?"}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">{req.message}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}