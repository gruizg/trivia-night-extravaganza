"use client"

import { useState } from "react";

// Halftime ("tens") questions aren't graded correct/incorrect - the host
// counts how many individual answers within this one response were right
// (2 points each) and submits the total.
function HalftimeRow({ response, onMarkHalftime }) {
    const team = response.team ?? {};
    const [correctCount, setCorrectCount] = useState(0);

    return (
        <li className="card-compact p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-subtle">
                        Team {team.teamNumber ?? "?"}{team.teamName ? ` · ${team.teamName}` : ""}
                    </p>
                    <p className="text-lg text-emphasis">
                        {response.responseAnswer}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setCorrectCount((c) => Math.max(0, c - 1))}
                            className="btn-ghost px-3 py-1.5 text-lg"
                            aria-label="Decrease correct count"
                        >
                            −
                        </button>
                        <span className="min-w-[6rem] text-center text-sm heading">
                            {correctCount} correct
                        </span>
                        <button
                            type="button"
                            onClick={() => setCorrectCount((c) => c + 1)}
                            className="btn-ghost px-3 py-1.5 text-lg"
                            aria-label="Increase correct count"
                        >
                            +
                        </button>
                    </div>
                    <p className="whitespace-nowrap text-xs text-muted-light">
                        {correctCount * 2} pts
                    </p>
                    <button
                        onClick={() => onMarkHalftime(response, correctCount)}
                        className="btn-primary px-3 py-1.5 text-sm"
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
        <li className="card-compact p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-subtle">
                        Team {team.teamNumber ?? "?"}{team.teamName ? ` · ${team.teamName}` : ""}
                    </p>
                    <p className="text-lg text-emphasis">
                        {response.responseAnswer}
                    </p>
                    {response.responseWager !== undefined && response.responseWager !== null && (
                        <p className="text-xs text-muted-light">Wager: {response.responseWager}</p>
                    )}
                </div>

                <div className="flex shrink-0 gap-2">
                    <button
                        onClick={() => onMark(response, "CORRECT")}
                        className={`rounded px-3 py-1 text-sm font-bold ${
                            isGraded && response.responseStatus === "CORRECT"
                                ? "toggle-success-active"
                                : "toggle-success"
                        }`}
                    >
                        Correct
                    </button>
                    <button
                        onClick={() => onMark(response, "INCORRECT")}
                        className={`rounded px-3 py-1 text-sm font-bold ${
                            isGraded && response.responseStatus === "INCORRECT"
                                ? "toggle-error-active"
                                : "toggle-error"
                        }`}
                    >
                        Incorrect
                    </button>
                </div>
            </div>
        </li>
    );
}