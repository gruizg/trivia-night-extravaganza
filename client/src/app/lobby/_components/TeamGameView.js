"use client"

import { useCallback, useEffect, useState } from "react";
import useGameEvents from "@/app/hooks/useGameEvents";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const HALFTIME = "HALFTIME";
const FINAL = "FINAL";

async function parseErrorMessage(res) {
    const raw = await res.text().catch(() => "");
    if (!raw) return "Could not submit your answer.";

    try {
        const body = JSON.parse(raw);
        if (Array.isArray(body)) return body.join(" ");
        if (body?.message) return body.message;
        return raw;
    } catch {
        return raw;
    }
}

function Verdict({ response, showVerdict }) {
    if (!showVerdict) {
        return (
            <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
                Pending
            </span>
        );
    }
    if (response.responseStatus === "CORRECT") {
        return (
            <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                Correct
            </span>
        );
    }
    if (response.responseStatus === "INCORRECT") {
        return (
            <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                Incorrect
            </span>
        );
    }
    if (response.responseStatus === "AMEND") {
        return (
            <span className="inline-block rounded bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-700">
                Amendment Requested
            </span>
        );
    }
    return (
        <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
            Pending
        </span>
    );
}

export default function TeamGameView({ teamId, gameId, questionId, gameStatus, myTeam }) {
    const [question, setQuestion] = useState(null);
    const [wagers, setWagers] = useState([]);
    const [responses, setResponses] = useState([]);
    const [answerText, setAnswerText] = useState("");
    const [selectedWager, setSelectedWager] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Amendment request state: which past response's form is open, and
    // that form's own reason text/submit state, kept separate from the
    // current-question answer form above.
    const [amendingId, setAmendingId] = useState(null);
    const [amendReason, setAmendReason] = useState("");
    const [amendSubmitting, setAmendSubmitting] = useState(false);
    const [amendError, setAmendError] = useState(null);

    const questionType = (question?.questionType ?? "").toUpperCase();
    const isHalftime = questionType === HALFTIME;
    const isFinal = questionType === FINAL;

    const roundLabel = isHalftime
        ? "Halftime Round"
        : isFinal
            ? "Final Round"
            : question?.questionRound
                ? `Round ${question.questionRound}`
                : null;

    const answersOpen = gameStatus === "QUESTION";
    const isRevealed = gameStatus === "REVEAL";

    const myResponse = responses.find(
        (r) => String(r.question?.questionId) === String(questionId)
    );

    // Only count points from current response if the answer was explicitly revealed
    const score = responses.reduce((sum, r) => {
        const isCurrent = String(r.question?.questionId) === String(questionId);
        if (isCurrent && !isRevealed) {
            return sum;
        }
        return sum + (r.responsePoints ?? 0);
    }, 0);

    const history = [...responses]
        .filter((r) => String(r.question?.questionId) !== String(questionId))
        .reverse();

    const loadQuestionAndResponses = useCallback(async () => {
        if (!questionId) return;
        setLoading(true);

        try {
            const qRes = await fetch(`${API_URL}/theme/question/${questionId}`);
            const questionData = qRes.ok ? await qRes.json() : null;
            setQuestion(questionData);

            const type = (questionData?.questionType ?? "").toUpperCase();
            if (type !== HALFTIME && type !== FINAL) {
                const wagersRes = await fetch(
                    `${API_URL}/response/wagers/${teamId}/${questionData.questionRound}`
                );
                if (wagersRes.ok) setWagers(await wagersRes.json());
            }

            const respRes = await fetch(`${API_URL}/response/team/${teamId}`);
            if (respRes.ok) setResponses(await respRes.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [questionId, teamId]);

    useEffect(() => {
        setAnswerText("");
        setSelectedWager("");
    }, [questionId]);

    useEffect(() => {
        loadQuestionAndResponses();
    }, [questionId, gameStatus, loadQuestionAndResponses]);

    // Pushed whenever any response in the game is submitted, graded, or
    // amended. Without this, a response only refreshed when questionId or
    // gameStatus happened to change for some unrelated reason (stopping
    // submissions, revealing, moving on) - so an amend request the host
    // resolved on a past question wouldn't show up here until one of those
    // unrelated things happened next. This keeps it immediate. (Verdicts
    // for the *current* question are still gated by isRevealed below, so
    // this doesn't leak an early grade.)
    useGameEvents(gameId, {
        response: () => loadQuestionAndResponses(),
    });

    async function handleSubmit(e) {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setError(null);

        const wagerValue = isHalftime ? 0 : Number(selectedWager);

        try {
            const res = await fetch(`${API_URL}/response`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    responseAnswer: answerText.trim(),
                    responseWager: wagerValue,
                    team: { teamId },
                    question: { questionId, questionRound: question?.questionRound },
                }),
            });

            if (!res.ok) {
                throw new Error(await parseErrorMessage(res));
            }

            const created = await res.json();
            setResponses((prev) => [...prev, created]);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    function openAmendForm(responseId) {
        setAmendingId(responseId);
        setAmendReason("");
        setAmendError(null);
    }

    function closeAmendForm() {
        setAmendingId(null);
        setAmendReason("");
        setAmendError(null);
    }

    async function submitAmendRequest(response) {
        if (amendSubmitting) return;
        setAmendSubmitting(true);
        setAmendError(null);

        try {
            const res = await fetch(`${API_URL}/response/${response.responseId}/amend`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ responseAmendReason: amendReason.trim() }),
            });

            if (!res.ok) throw new Error(await parseErrorMessage(res));

            // The backend only ever flips responseStatus to AMEND on the
            // entity itself - the reason text comes back alongside it in a
            // separate field, not on the entity, so it's merged back on
            // here purely for this tab's own display.
            const { response: updatedResponse, responseAmendReason } = await res.json();
            const updated = { ...updatedResponse, responseAmendReason };
            setResponses((prev) =>
                prev.map((r) => (r.responseId === updated.responseId ? updated : r))
            );
            closeAmendForm();
        } catch (err) {
            setAmendError(err.message);
        } finally {
            setAmendSubmitting(false);
        }
    }

    return (
        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Team {myTeam?.teamNumber} {myTeam?.teamName}
                    </h1>
                    <p className="text-sm font-semibold text-gray-500">Score: {score}</p>
                </div>

                <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    {history.length === 0 ? (
                        <p className="text-sm text-gray-400">No previous questions yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {history.map((r) => (
                                <li
                                    key={r.responseId}
                                    className="rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                                            {r.question?.questionPrompt ?? `Question ${r.question?.questionId}`}
                                        </p>
                                        <Verdict response={r} showVerdict={true} />
                                    </div>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                                        Answered: {r.responseAnswer}
                                    </p>
                                    {r.responseWager > 0 && (
                                        <p className="text-gray-500">Wagered: {r.responseWager}</p>
                                    )}

                                    {r.responseStatus === "INCORRECT" && amendingId !== r.responseId && (
                                        <button
                                            onClick={() => openAmendForm(r.responseId)}
                                            className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                                        >
                                            Request Amendment
                                        </button>
                                    )}

                                    {r.responseStatus === "AMEND" && r.responseAmendReason && (
                                        <p className="mt-2 text-xs italic text-gray-500">
                                            Your reason: "{r.responseAmendReason}"
                                        </p>
                                    )}

                                    {amendingId === r.responseId && (
                                        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
                                            <p className="text-xs font-bold uppercase text-gray-500">
                                                Question
                                            </p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                {r.question?.questionPrompt ?? `Question ${r.question?.questionId}`}
                                            </p>

                                            <p className="mt-2 text-xs font-bold uppercase text-gray-500">
                                                Your Answer
                                            </p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                {r.responseAnswer}
                                            </p>

                                            <label className="mt-3 flex flex-col gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                Why should this have been marked correct?
                                                <textarea
                                                    value={amendReason}
                                                    onChange={(e) => setAmendReason(e.target.value)}
                                                    required
                                                    rows={3}
                                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Explain your reasoning..."
                                                />
                                            </label>

                                            {amendError && (
                                                <p className="mt-2 text-xs text-red-600">{amendError}</p>
                                            )}

                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => submitAmendRequest(r)}
                                                    disabled={amendSubmitting || !amendReason.trim()}
                                                    className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                                                >
                                                    {amendSubmitting ? "Sending..." : "Send Request"}
                                                </button>
                                                <button
                                                    onClick={closeAmendForm}
                                                    disabled={amendSubmitting}
                                                    className="rounded bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    {roundLabel && (
                        <span
                            className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase ${
                                isHalftime
                                    ? "bg-amber-100 text-amber-700"
                                    : isFinal
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                        >
                            {roundLabel}
                        </span>
                    )}
                    <p className="font-semibold text-gray-900 dark:text-white">
                        {question?.questionCategory}: {question?.questionPrompt}
                    </p>
                </div>

                {error && (
                    <p className="rounded bg-red-100 px-4 py-2 text-sm text-red-700">{error}</p>
                )}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    {myResponse ? (
                        <div>
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <p className="text-sm font-bold uppercase text-gray-400">Your Answer</p>
                                <Verdict response={myResponse} showVerdict={isRevealed} />
                            </div>
                            <p className="mb-4 text-lg text-gray-800 dark:text-gray-200">
                                {myResponse.responseAnswer}
                            </p>
                            {!isHalftime && (
                                <>
                                    <p className="text-sm font-bold uppercase text-gray-400">
                                        Points Wagered
                                    </p>
                                    <p className="mb-4 text-lg text-gray-800 dark:text-gray-200">
                                        {myResponse.responseWager}
                                    </p>
                                </>
                            )}
                            {isRevealed && (
                                <>
                                    <p className="text-sm font-bold uppercase text-gray-400">
                                        Correct Answer
                                    </p>
                                    <p className="mb-4 text-lg text-gray-800 dark:text-gray-200">
                                        {question?.questionAnswer ?? "—"}
                                    </p>
                                </>
                            )}
                            <p className="text-sm font-semibold text-gray-500">
                                {isRevealed
                                    ? "Waiting for the next question..."
                                    : answersOpen
                                        ? "Answer locked in. Waiting for the round to close..."
                                        : "Answers are closed. Waiting for the reveal..."}
                            </p>
                        </div>
                    ) : loading ? (
                        <p className="text-sm text-gray-400">Loading question...</p>
                    ) : !answersOpen ? (
                        <div>
                            <p className="text-sm font-bold uppercase text-gray-400">Your Answer</p>
                            <p className="mt-2 text-lg text-gray-400">No answer submitted.</p>
                            {isRevealed && (
                                <>
                                    <p className="mt-4 text-sm font-bold uppercase text-gray-400">
                                        Correct Answer
                                    </p>
                                    <p className="text-lg text-gray-800 dark:text-gray-200">
                                        {question?.questionAnswer ?? "—"}
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                required
                                className="rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="Type your answer"
                            />

                            {isFinal && (
                                <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Wager (0-15)
                                    <input
                                        type="number"
                                        min={0}
                                        max={15}
                                        value={selectedWager}
                                        onChange={(e) => setSelectedWager(e.target.value)}
                                        required
                                        className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </label>
                            )}

                            {!isHalftime && !isFinal && (
                                <div className="flex flex-wrap items-center gap-4">
                                    {wagers.length === 0 ? (
                                        <p className="text-sm text-gray-400">No wagers available.</p>
                                    ) : (
                                        wagers.map((w) => (
                                            <label
                                                key={w}
                                                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                <input
                                                    type="radio"
                                                    name="wager"
                                                    value={w}
                                                    checked={String(selectedWager) === String(w)}
                                                    onChange={(e) => setSelectedWager(e.target.value)}
                                                    required
                                                    className="h-4 w-4"
                                                />
                                                {w}
                                            </label>
                                        ))
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {submitting ? "Submitting..." : "Submit"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}