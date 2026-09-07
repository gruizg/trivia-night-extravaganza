"use client"

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResponseRow from "@/app/host/_components/ResponseRow";
import AmendRequests from "@/app/host/_components/AmendRequests";

const API_URL = "http://localhost:8080/api";
const POLL_MS = 3000;

export default function HostGame() {
    const searchParams = useSearchParams();
    const gameId = searchParams.get("gameId");

    const [game, setGame] = useState(null);
    const [question, setQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState(null);

    // Derived from the game's status rather than tracked separately, so the
    // UI can never drift out of sync with what's actually persisted:
    //   QUESTION -> accepting incoming answers
    //   REVIEW   -> answers closed, host is grading, not yet shown to teams
    //   REVEAL   -> host has revealed correctness to teams
    const isAccepting = game?.gameStatus === "QUESTION";
    const isReviewing = game?.gameStatus === "REVIEW";
    const isRevealed = game?.gameStatus === "REVEAL";

    // Load the game, then the question list for its theme.
    const loadGame = useCallback(async () => {
        if (!gameId) return;

        try {
            const res = await fetch(`${API_URL}/game/${gameId}`);
            if (!res.ok) throw new Error("Game not found");
            const gameData = await res.json();
            setGame(gameData);

            if (gameData.theme?.themeId) {
                const qRes = await fetch(`${API_URL}/theme/question/all/${gameData.theme.themeId}`);
                if (qRes.ok) {
                    setQuestions(await qRes.json());
                }
            }

            if (gameData.currentQuestion?.questionId) {
                const currentQRes = await fetch(
                    `${API_URL}/theme/question/${gameData.currentQuestion.questionId}`
                );
                if (currentQRes.ok) {
                    setQuestion(await currentQRes.json());
                }
            }
        } catch (err) {
            setError(err.message);
        }
    }, [gameId]);

    // Poll incoming responses for the current question.
    const loadResponses = useCallback(async () => {
        if (!gameId || !question?.questionId) return;

        try {
            const res = await fetch(`${API_URL}/response/question/${gameId}/${question.questionId}`);
            if (res.ok) {
                const data = await res.json();
                // The endpoint returns every response for the question, graded
                // or not — filter to ungraded ones so a response the host has
                // already marked can't pop back into the incoming list on the
                // next poll.
                setResponses(
                    data.filter(
                        (r) => r.responseCorrect === null || r.responseCorrect === undefined
                    )
                );
            }
        } catch (err) {
            setError(err.message);
        }
    }, [gameId, question]);

    useEffect(() => {
        loadGame();
    }, [loadGame]);

    useEffect(() => {
        loadResponses();
        const interval = setInterval(loadResponses, POLL_MS);
        return () => clearInterval(interval);
    }, [loadResponses]);

    async function markResponse(response, correct) {
        try {
            const res = await fetch(`${API_URL}/response/${response.responseId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...response, responseCorrect: correct }),
            });

            if (res.ok) {
                // Graded responses drop off the incoming list — the host
                // only needs to see what's still waiting to be judged.
                setResponses((prev) =>
                    prev.filter((r) => r.responseId !== response.responseId)
                );
            } else {
                setError("Could not update that response.");
            }
        } catch (err) {
            setError(err.message);
        }
    }

    // Closes the question to new incoming responses. This is one-way for a
    // given question — once stopped, the host can't reopen it; the only way
    // forward is to reveal, then move to the next question.
    async function stopAccepting() {
        if (!game || !isAccepting) return;

        try {
            const res = await fetch(`${API_URL}/game/${gameId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...game, gameStatus: "REVIEW" }),
            });

            if (res.ok) {
                setGame(await res.json());
            } else {
                setError("Could not stop incoming answers.");
            }
        } catch (err) {
            setError(err.message);
        }
    }

    // Reveals correctness to every team at once, rather than teams seeing
    // results trickle in as the host grades responses one by one.
    async function revealAnswer() {
        if (!game || !isReviewing) return;

        try {
            const res = await fetch(`${API_URL}/game/${gameId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...game, gameStatus: "REVEAL" }),
            });

            if (res.ok) {
                setGame(await res.json());
            } else {
                setError("Could not reveal the answer.");
            }
        } catch (err) {
            setError(err.message);
        }
    }

    async function nextQuestion() {
        if (!game || questions.length === 0 || !isRevealed) return;

        // Sort by round/order for normal (and tiebreaker) rounds, but pin
        // HALFTIME between rounds 3 and 4, and FINAL to the very end,
        // regardless of whatever round value they're stored under.
        const sortKey = (q) => {
            const type = (q.questionType ?? "").toUpperCase();
            if (type === "HALFTIME") return 3.5;
            if (type === "FINAL") return Infinity;
            return q.questionRound;
        };

        const ordered = [...questions].sort((a, b) => {
            const ka = sortKey(a);
            const kb = sortKey(b);
            return ka !== kb ? ka - kb : a.questionOrder - b.questionOrder;
        });

        const currentIndex = ordered.findIndex(
            (q) => q.questionId === question?.questionId
        );
        const next = ordered[currentIndex + 1];

        if (!next) {
            setError("No more questions in this theme.");
            return;
        }

        const nextType = (next.questionType ?? "").toUpperCase();
        const isSpecialRound = nextType === "HALFTIME" || nextType === "FINAL";

        try {
            const res = await fetch(`${API_URL}/game/${gameId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...game,
                    gameStatus: "QUESTION",
                    // Halftime/final aren't part of the normal round sequence,
                    // so leave currentRound as-is rather than overwriting it
                    // with whatever round value they happen to be stored under.
                    currentRound: isSpecialRound ? game.currentRound : next.questionRound,
                    currentQuestion: { questionId: next.questionId },
                }),
            });

            if (res.ok) {
                const updated = await res.json();
                setGame(updated);
                setQuestion(next);
                setResponses([]);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    if (!gameId) {
        return (
            <div>
                <h1 className="mb-4 text-2xl font-bold">Host</h1>
                <p className="text-gray-500">
                    No game selected. Start a game from the Themes page to host.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <h1 className="mb-4 text-2xl font-bold">Host</h1>

            {error && (
                <p className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700">{error}</p>
            )}

            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Current question + controls */}
                <div className="flex flex-col gap-4">
                    <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                            Current Question
                        </h2>
                        <p className="mb-6 text-gray-700 dark:text-gray-300">
                            {question?.questionPrompt ?? "Waiting for a question..."}
                        </p>

                        <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                            Answer
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {question?.questionAnswer ?? "—"}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {isRevealed ? (
                            <button
                                disabled
                                className="flex-1 cursor-default rounded-lg bg-gray-100 px-4 py-3 text-sm font-bold text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                            >
                                Answer Revealed
                            </button>
                        ) : isReviewing ? (
                            <button
                                onClick={revealAnswer}
                                className="flex-1 rounded-lg bg-purple-600 px-4 py-3 text-sm font-bold text-white hover:bg-purple-700"
                            >
                                Reveal Answer
                            </button>
                        ) : (
                            <button
                                onClick={stopAccepting}
                                className="flex-1 rounded-lg bg-gray-800 px-4 py-3 text-sm font-bold text-white hover:bg-gray-700"
                            >
                                Stop Incoming Answers
                            </button>
                        )}
                        <button
                            onClick={nextQuestion}
                            disabled={!isRevealed}
                            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
                        >
                            Next Question
                        </button>
                    </div>
                </div>

                {/* Incoming responses */}
                <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                        Incoming Responses
                    </h2>

                    {responses.length === 0 ? (
                        <p className="text-sm text-gray-400">No responses yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-3 overflow-y-auto">
                            {responses.map((response) => (
                                <ResponseRow
                                    key={response.responseId}
                                    response={response}
                                    onMark={markResponse}
                                />
                            ))}
                        </ul>
                    )}
                </div>

                {/* Amend answer requests */}
                <AmendRequests requests={[]} />
            </div>
        </div>
    );
}