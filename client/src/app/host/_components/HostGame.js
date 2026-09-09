"use client"

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResponseRow from "@/app/host/_components/ResponseRow";
import AmendRequests from "@/app/host/_components/AmendRequests";
import TeamRankings from "@/app/host/_components/TeamRankings";
import FinalRankings from "@/app/components/FinalRankings";
import useGameEvents from "@/app/hooks/useGameEvents";
import { loadAmendReasons, saveAmendReasons } from "@/app/host/_components/amendReasonCache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HostGame() {
    const searchParams = useSearchParams();
    const gameId = searchParams.get("gameId");

    const [game, setGame] = useState(null);
    const [question, setQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState([]);
    const [teams, setTeams] = useState([]);
    const [amendRequests, setAmendRequests] = useState([]);
    // The reason text is intentionally never persisted server-side (see
    // ResponseService.requestAmend), so it only ever exists on the single
    // SSE "response" event the request goes out on. This captures it into
    // a browser-local cache (see amendReasonCache.js), keyed by
    // responseId, so it survives this host reloading the page without the
    // backend storing it anywhere.
    const [amendReasons, setAmendReasons] = useState({});
    const [error, setError] = useState(null);

    const isAccepting = game?.gameStatus === "QUESTION";
    const isReviewing = game?.gameStatus === "REVIEW";
    const isRevealed = game?.gameStatus === "REVEAL";
    const isGameEnded = game?.gameStatus === "ENDED";

    const questionType = (question?.questionType ?? "").toUpperCase();
    const isHalftime = questionType === "HALFTIME";
    const isFinal = questionType === "FINAL";

    const roundLabel = isHalftime
        ? "Halftime Round"
        : isFinal
            ? "Final Round"
            : question?.questionRound
                ? `Round ${question.questionRound}`
                : null;

    // Every question in the same round as whatever's on screen, so the
    // host can read off all of this round's categories before diving in -
    // not just the one for the current question. HALFTIME/FINAL each form
    // their own round rather than grouping by questionRound.
    const roundQuestions = question
        ? [...questions]
            .filter((q) => {
                const type = (q.questionType ?? "").toUpperCase();
                if (isHalftime || isFinal) return type === questionType;
                return (
                    type !== "HALFTIME" &&
                    type !== "FINAL" &&
                    q.questionRound === question.questionRound
                );
            })
            .sort((a, b) => a.questionOrder - b.questionOrder)
        : [];

    // Pull in any reasons already cached from a previous load of this game
    // before this tab existed (e.g. the host refreshed the page).
    useEffect(() => {
        setAmendReasons(loadAmendReasons(gameId));
    }, [gameId]);

    function updateAmendReasons(updater) {
        setAmendReasons((prev) => {
            const next = updater(prev);
            saveAmendReasons(gameId, next);
            return next;
        });
    }

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

            const collectedAmendRequests = [];

            const withScores = await Promise.all(
                teamsData.map(async (team) => {
                    const respRes = await fetch(`${API_URL}/response/team/${team.teamId}`);
                    const teamResponses = respRes.ok ? await respRes.json() : [];

                    // Teams can request an amendment on any past response that
                    // was marked incorrect, not just the current question, so
                    // this scans every team's full response history rather
                    // than the current-question response list above.
                    teamResponses
                        .filter((r) => r.responseStatus === "AMEND")
                        .forEach((r) => collectedAmendRequests.push({ ...r, team }));

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
            setAmendRequests(collectedAmendRequests);
        } catch (err) {
            setError(err.message);
        }
    }, [gameId, question, isRevealed]);

    useEffect(() => {
        loadGame();
    }, [loadGame]);

    useEffect(() => {
        loadResponses();
    }, [loadResponses]);

    useEffect(() => {
        loadTeams();
    }, [loadTeams]);

    // Pushed by the server whenever a team submits, requests an amendment,
    // or the host grades a response, instead of re-fetching both lists on
    // a timer.
    useGameEvents(gameId, {
        response: (payload) => {
            // Amendment requests broadcast an AmendedResponseDto - the
            // untouched response entity plus the reason kept alongside it -
            // rather than a plain Response, since the entity itself never
            // carries the reason (only its status changes, to AMEND).
            const amended = payload?.response;
            if (amended?.responseStatus === "AMEND" && payload?.responseAmendReason) {
                updateAmendReasons((prev) => ({
                    ...prev,
                    [amended.responseId]: payload.responseAmendReason,
                }));
            }
            loadResponses();
            loadTeams();
        },
        team: () => {
            loadTeams();
        },
    });

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

    // Halftime ("tens") questions aren't a single correct/incorrect call -
    // the host counts how many individual answers within one team's
    // response were right (2 points each) and submits the total. The
    // wager is always forced to 0 for halftime responses (see
    // TeamGameView), so the backend's usual wager-based scoring for
    // CORRECT/INCORRECT wouldn't award anything here; sending
    // responsePoints explicitly overrides that for this response.
    async function markHalftimeResponse(response, correctCount) {
        const { responsePoints, ...rest } = response;

        try {
            const res = await fetch(`${API_URL}/response/${response.responseId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...rest,
                    responseStatus: "CORRECT",
                    responsePoints: correctCount * 2,
                }),
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

    async function resolveAmendRequest(request, accept) {
        // `request` here is a display-only object: the real Response plus
        // a `responseAmendReason` merged in just for AmendRequests to show
        // (see the amendReasons map below). That field lives client-side
        // only now - the entity itself never carries it - so it has to be
        // stripped back out before PUTing, or the backend rejects the body
        // as an unrecognized property.
        const { responsePoints, responseAmendReason, ...rest } = request;

        try {
            const res = await fetch(`${API_URL}/response/${request.responseId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...rest,
                    responseStatus: accept ? "CORRECT" : "INCORRECT",
                }),
            });

            if (res.ok) {
                setAmendRequests((prev) =>
                    prev.filter((r) => r.responseId !== request.responseId)
                );
                setAmendReasons((prev) => {
                    const next = { ...prev };
                    delete next[request.responseId];
                    saveAmendReasons(gameId, next);
                    return next;
                });
                loadTeams();
            } else {
                setError("Could not resolve that amendment request.");
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

    // Only offered once the FINAL question has been revealed - there's no
    // next question after it, so this replaces "Next Question" on that
    // last screen. Reuses the same gameStatus field the rest of the flow
    // already drives off of; teams pick this up over the same "game" SSE
    // event as every other status change and switch to FinalRankings.
    async function endGame() {
        if (!game || !isRevealed || !isFinal) return;

        try {
            const res = await fetch(`${API_URL}/game/${gameId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...game, gameStatus: "ENDED" }),
            });

            if (res.ok) {
                setGame(await res.json());
            } else {
                setError("Could not end the game.");
            }
        } catch (err) {
            setError(err.message);
        }
    }

    if (!gameId) {
        return (
            <div>
                <h1 className="mb-4 text-2xl font-bold">Host</h1>
                <p className="text-dim">
                    No game selected. Start a game from the Themes page to host.
                </p>
            </div>
        );
    }

    if (isGameEnded) {
        return (
            <div className="flex h-full flex-col">
                <h1 className="mb-4 text-2xl font-bold">Host</h1>
                <FinalRankings gameId={gameId} />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <h1 className="mb-4 text-2xl font-bold">Host</h1>

            {error && (
                <p className="mb-4 alert-error px-4 py-2">{error}</p>
            )}

            <div className="flex flex-1 min-h-0 flex-col gap-6 lg:flex-row">
                <div className="flex min-h-0 flex-col gap-4 lg:min-w-0 lg:flex-1">
                    <div className="flex-1 card p-6 overflow-y-auto">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <h2 className="text-lg heading">
                                Current Question
                            </h2>
                            {roundLabel && (
                                <span
                                    className={`badge-round px-3 py-1 ${
                                        isHalftime
                                            ? "badge-round-amber"
                                            : isFinal
                                                ? "badge-round-purple"
                                                : "badge-round-neutral"
                                    }`}
                                >
                                    {roundLabel}
                                </span>
                            )}
                        </div>

                        {question?.questionCategory && (
                            <p className="mb-1 label-caps-accent-blue">
                                {question.questionCategory}
                            </p>
                        )}
                        <p className="mb-6 text-secondary">
                            {question?.questionPrompt ?? "Waiting for a question..."}
                        </p>

                        <h2 className="mb-2 text-lg heading">
                            Answer
                        </h2>
                        <p className="text-secondary">
                            {question?.questionAnswer ?? "—"}
                        </p>

                        {roundQuestions.length > 0 && (
                            <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                                <h3 className="mb-2 label-caps-muted">
                                    {roundLabel ? `${roundLabel} Categories` : "Round Categories"}
                                </h3>
                                <ul className="flex flex-col gap-1">
                                    {roundQuestions.map((q) => (
                                        <li
                                            key={q.questionId}
                                            className={`text-sm ${
                                                q.questionId === question?.questionId
                                                    ? "heading"
                                                    : "text-muted"
                                            }`}
                                        >
                                            {q.questionCategory ?? "Uncategorized"}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex-1" />

                    <div className="flex gap-2">
                        {isRevealed ? (
                            <button
                                disabled
                                className="flex-1 btn-disabled px-4 py-3 text-sm"
                            >
                                Answer Revealed
                            </button>
                        ) : isReviewing ? (
                            <button
                                onClick={revealAnswer}
                                className="flex-1 btn-purple px-4 py-3 text-sm"
                            >
                                Reveal Answer
                            </button>
                        ) : (
                            <button
                                onClick={stopAccepting}
                                className="flex-1 btn-dark px-4 py-3 text-sm"
                            >
                                Stop Incoming Answers
                            </button>
                        )}
                        {isFinal ? (
                            <button
                                onClick={endGame}
                                disabled={!isRevealed}
                                className="flex-1 btn-success px-4 py-3 text-sm"
                            >
                                End Game
                            </button>
                        ) : (
                            <button
                                onClick={nextQuestion}
                                disabled={!isRevealed}
                                className="flex-1 btn-primary px-4 py-3 text-sm disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                            >
                                Next Question
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex min-h-0 flex-col gap-6 lg:min-w-0 lg:flex-1">
                    <div className="flex flex-1 min-h-0 flex-col card p-6">
                        <h2 className="mb-4 text-lg heading">
                            Incoming Responses
                        </h2>

                        {responses.length === 0 ? (
                            <p className="text-hint">No responses yet.</p>
                        ) : (
                            <ul className="flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto">
                                {responses.map((response) => (
                                    <ResponseRow
                                        key={response.responseId}
                                        response={response}
                                        onMark={markResponse}
                                        onMarkHalftime={markHalftimeResponse}
                                        isHalftime={isHalftime}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex flex-1 min-h-0 flex-col">
                        <AmendRequests
                            requests={amendRequests.map((r) => ({
                                ...r,
                                responseAmendReason: amendReasons[r.responseId],
                            }))}
                            questions={questions}
                            onResolve={resolveAmendRequest}
                        />
                    </div>
                </div>

                <div className="flex min-h-0 flex-col lg:min-w-0 lg:flex-1">
                    <TeamRankings teams={teams} />
                </div>
            </div>
        </div>
    );
}