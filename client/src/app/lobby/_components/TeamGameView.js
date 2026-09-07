"use client"

import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api";

// Question type values as sent by the backend (learn.trivia.models.QuestionType).
const HALFTIME = "HALFTIME";
const FINAL = "FINAL";

// Small badge for a graded response: green/red once the host has marked it,
// a neutral "Ungraded" label if the host never got to it before revealing.
function Verdict({ response }) {
    if (response.responseCorrect === true) {
        return (
            <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                Correct
            </span>
        );
    }
    if (response.responseCorrect === false) {
        return (
            <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                Incorrect
            </span>
        );
    }
    return (
        <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
            Ungraded
        </span>
    );
}

export default function TeamGameView({ teamId, questionId, gameStatus, myTeam }) {
    const [question, setQuestion] = useState(null);
    const [wagers, setWagers] = useState([]);
    const [responses, setResponses] = useState([]);
    const [answerText, setAnswerText] = useState("");
    const [selectedWager, setSelectedWager] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const questionType = (question?.questionType ?? "").toUpperCase();
    const isHalftime = questionType === HALFTIME;
    const isFinal = questionType === FINAL;

    // QUESTION = host is still accepting answers; REVIEW = closed, host is
    // grading; REVEAL = host has revealed correctness for this question.
    const answersOpen = gameStatus === "QUESTION";
    const isRevealed = gameStatus === "REVEAL";

    const myResponse = responses.find(
        (r) => String(r.question?.questionId) === String(questionId)
    );

    // Every graded, correct response contributes its wager to the score.
    const score = responses.reduce(
        (sum, r) => sum + (r.responseCorrect ? r.responseWager ?? 0 : 0),
        0
    );

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
                // Fetch available wagers using the QUESTION's own round, not
                // game.currentRound — the backend validates a submitted wager
                // against question.getQuestionRound() directly, and that can
                // drift from game.currentRound (e.g. it's deliberately left
                // untouched across a HALFTIME question). Using the same field
                // the backend checks keeps the two guaranteed in sync.
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

    // Reset the form whenever the question changes.
    useEffect(() => {
        setAnswerText("");
        setSelectedWager("");
        loadQuestionAndResponses();
    }, [questionId, loadQuestionAndResponses]);

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
                    question: { questionId },
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const message = Array.isArray(body)
                    ? body.join(" ")
                    : body?.message ?? "Could not submit your answer.";
                throw new Error(message);
            }

            const created = await res.json();
            setResponses((prev) => [...prev, created]);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Team identity + history */}
            <div className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Team {myTeam?.teamId} {myTeam?.teamName}
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
                                        <Verdict response={r} />
                                    </div>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                                        Answered: {r.responseAnswer}
                                    </p>
                                    {r.responseWager > 0 && (
                                        <p className="text-gray-500">Wagered: {r.responseWager}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Current question */}
            <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
                                {isRevealed && <Verdict response={myResponse} />}
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