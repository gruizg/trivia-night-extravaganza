"use client"

export default function ResponseRow({ response, onMark }) {
    const team = response.team ?? {};
    const isGraded = response.responseStatus !== "PENDING";

    return (
        <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Team {team.teamNumber ?? "?"}{team.teamName ? ` · ${team.teamName}` : ""}
                    </p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {response.responseAnswer}
                    </p>
                    {response.responseWager !== undefined && response.responseWager !== null && (
                        <p className="text-xs text-gray-400">Wager: {response.responseWager}</p>
                    )}
                </div>

                <div className="flex shrink-0 gap-2">
                    <button
                        onClick={() => onMark(response, "CORRECT")}
                        className={`rounded px-3 py-1 text-sm font-bold ${
                            isGraded && response.responseStatus === "CORRECT"
                                ? "bg-green-600 text-white"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                    >
                        Correct
                    </button>
                    <button
                        onClick={() => onMark(response, "INCORRECT")}
                        className={`rounded px-3 py-1 text-sm font-bold ${
                            isGraded && response.responseStatus === "INCORRECT"
                                ? "bg-red-600 text-white"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                    >
                        Incorrect
                    </button>
                </div>
            </div>
        </li>
    );
}