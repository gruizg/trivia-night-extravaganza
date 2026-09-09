"use client"

import { useState } from "react";

// Halftime ("tens") questions aren't graded correct/incorrect - the host
// counts how many individual answers within this one response were right
// (2 points each) and submits the total.
function HalftimeRow({ response, onMarkHalftime }) {
    const team = response.team ?? {};
    const [correctCount, setCorrectCount] = useState(0);

    return (
        <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Team {team.teamNumber ?? "?"}{team.teamName ? ` · ${team.teamName}` : ""}
                    </p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {response.responseAnswer}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setCorrectCount((c) => Math.max(0, c - 1))}
                            className="px-3 py-1.5 text-lg font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Decrease correct count"
                        >
                            −
                        </button>
                        <span className="min-w-[6rem] text-center text-sm font-bold text-gray-900 dark:text-white">
                            {correctCount} correct
                        </span>
                        <button
                            type="button"
                            onClick={() => setCorrectCount((c) => c + 1)}
                            className="px-3 py-1.5 text-lg font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Increase correct count"
                        >
                            +
                        </button>
                    </div>
                    <p className="whitespace-nowrap text-xs text-gray-400">
                        {correctCount * 2} pts
                    </p>
                    <button
                        onClick={() => onMarkHalftime(response, correctCount)}
                        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </li>
    );
}

export default function ResponseRow({ response, onMark, onMarkHalftime, isHalftime }) {
    if (isHalftime) {
        return <HalftimeRow response={response} onMarkHalftime={onMarkHalftime} />;
    }

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