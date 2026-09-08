"use client"

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResponseRow from "@/app/host/_components/ResponseRow";
import AmendRequests from "@/app/host/_components/AmendRequests";
import TeamRankings from "@/app/host/_components/TeamRankings";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const POLL_MS = 3000;

export default function HostGame() {
    const searchParams = useSearchParams();
    const gameId = searchParams.get("gameId");

    const [game, setGame] = useState(null);
    const [question, setQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState([]);
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);

    const isAccepting = game?.gameStatus === "QUESTION";
    const isReviewing = game?.gameStatus === "REVIEW";
    const isRevealed = game?.gameStatus === "REVEAL";

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

    const loadResponses = useCallback(async () => {
        if (!gameId || !question?.questionId) return;

        try {
            const res = await fetch(`${API_URL}/response/question/${gameId}/${question.questionId}`);
            if (res.ok) {
                const data = await res.json();
                setResponses(data.filter((r) => r.responseStatus === "PENDING"));
            }
        } catch (err) {
            setError(err.message);
        }
    }, [gameId, question]);

    const loadTeams = useCallback(async () => {
        if (!gameId) return;

        try {
            const teamsRes = await fetch(`${API_URL}/team/all/${gameId}`);
            if (!teamsRes.ok) return;
            const teamsData = await teamsRes.json();

            const withScores = await Promise.all(
                teamsData.map(async (team) => {
                    const respRes = await fetch(`${API_URL}/response/team/${team.teamId}`);
                    const teamResponses = respRes.ok ? await respRes.json() : [];

                    // Only sum points for responses where the question isn't the current unrevealed question
                    const score = teamResponses.reduce((sum, r) => {
                        const isCurrentQuestion = String(r.question?.questionId) === String(question?.questionId);
                        // If it's the current question, only count points if gameStatus is REVEAL
                        if (isCurrentQuestion && !isRevealed) {
                            return sum;
                        }
                        return sum + (r.responsePoints ?? 0);
                    }, 0);

                    return { ...team, score };
                })
            );

            setTeams(withScores);
        } catch (err) {
            setError(err.message);
        }
    }, [gameId, question, isRevealed]);

    useEffect(() => {
        loadGame();
    }, [loadGame]);

    useEffect(() => {
        loadResponses();
        const interval = setInterval(loadResponses, POLL_MS);
        return () => clearInterval(interval);
    }, [loadResponses]);

    useEffect(() => {
        loadTeams();
        const interval = setInterval(loadTeams, POLL_MS);
        return () => clearInterval(interval);
    }, [loadTeams]);

    async function markResponse(response, status) {
        const { responsePoints, ...rest } = response;

        try {
            const res = await fetch(`${API_URL}/response/${response.responseId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...rest, responseStatus: status }),
            });

            if (res.ok) {
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
                // Immediately refresh teams so scores update upon revealing
                loadTeams();
            } else {
                setError("Could not reveal the answer.");
            }
        } catch (err) {
            setError(err.message);
        }
    }

    async function nextQuestion() {
        if (!game || questions.length === 0 || !isRevealed) return;

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

            <div className="flex flex-1 min-h-0 flex-col gap-6 lg:flex-row">
                <div className="flex min-h-0 flex-col gap-4 lg:min-w-0 lg:flex-1">
                    <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-y-auto">
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

                    <div className="flex-1" />

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

                <div className="flex min-h-0 flex-col gap-6 lg:min-w-0 lg:flex-1">
                    <div className="flex flex-1 min-h-0 flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                            Incoming Responses
                        </h2>

                        {responses.length === 0 ? (
                            <p className="text-sm text-gray-400">No responses yet.</p>
                        ) : (
                            <ul className="flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto">
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

                    <div className="flex flex-1 min-h-0 flex-col">
                        <AmendRequests requests={[]} />
                    </div>
                </div>

                <div className="flex min-h-0 flex-col lg:min-w-0 lg:flex-1">
                    <TeamRankings teams={teams} />
                </div>
            </div>
        </div>
    );
}