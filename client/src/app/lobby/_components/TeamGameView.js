"use client"
export const dynamic = 'force-dynamic';

import { useCallback, useEffect, useState } from "react";
import useGameEvents from "@/app/hooks/useGameEvents";
import { loadAmendedResponses, markResponseAmended } from "@/app/lobby/_components/amendedResponsesCache";

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
            <span className="badge badge-neutral px-2 py-0.5">
                Pending
            </span>
        );
    }
    if (response.responseStatus === "CORRECT") {
        return (
            <span className="badge badge-success px-2 py-0.5">
                Correct
            </span>
        );
    }
    if (response.responseStatus === "INCORRECT") {
        return (
            <span className="badge badge-error px-2 py-0.5">
                Incorrect
            </span>
        );
    }
    if (response.responseStatus === "AMEND") {
        return (
            <span className="badge badge-warning px-2 py-0.5">
                Amendment Requested
            </span>
        );
    }
    return (
        <span className="badge badge-neutral px-2 py-0.5">
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
    const [amendedResponseIds, setAmendedResponseIds] = useState([]);

    // Load which of this team's responses already had an amend request
    // sent, so a response the host denied (which reverts to the same
    // INCORRECT status a never-amended response has) doesn't offer the
    // button again.
    useEffect(() => {
        setAmendedResponseIds(loadAmendedResponses(teamId));
    }, [teamId]);

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
            markResponseAmended(teamId, updated.responseId);
            setAmendedResponseIds((prev) => [...prev, updated.responseId]);
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
                    <h1 className="mt-2 text-3xl heading sm:text-4xl">
                        Team {myTeam?.teamNumber} {myTeam?.teamName}
                    </h1>
                    <p className="label-caps-accent">Score: {score}</p>
                </div>

                <div className="flex-1 overflow-y-auto card p-4">
                    {history.length === 0 ? (
                        <p className="text-hint">No previous questions yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {history.map((r) => (
                                <li
                                    key={r.responseId}
                                    className="list-row p-3 text-sm"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold text-body">
                                            {r.question?.questionPrompt ?? `Question ${r.question?.questionId}`}
                                        </p>
                                        <Verdict response={r} showVerdict={true} />
                                    </div>
                                    <p className="mt-1 text-muted">
                                        Answered: {r.responseAnswer}
                                    </p>
                                    {r.responseWager > 0 && (
                                        <p className="text-dim">Wagered: {r.responseWager}</p>
                                    )}

                                    {r.responseStatus === "INCORRECT" &&
                                        amendingId !== r.responseId &&
                                        !amendedResponseIds.includes(r.responseId) && (
                                        <button
                                            onClick={() => openAmendForm(r.responseId)}
                                            className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                                        >
                                            Request Amendment
                                        </button>
                                    )}

                                    {r.responseStatus === "AMEND" && r.responseAmendReason && (
                                        <p className="mt-2 text-xs italic text-subtle">
                                            Your reason: "{r.responseAmendReason}"
                                        </p>
                                    )}

                                    {amendingId === r.responseId && (
                                        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
                                            <p className="label-caps-sm">
                                                Question
                                            </p>
                                            <p className="text-sm text-body">
                                                {r.question?.questionPrompt ?? `Question ${r.question?.questionId}`}
                                            </p>

                                            <p className="mt-2 label-caps-sm">
                                                Your Answer
                                            </p>
                                            <p className="text-sm text-body">
                                                {r.responseAnswer}
                                            </p>

                                            <label className="mt-3 flex flex-col gap-1 text-xs font-semibold text-secondary">
                                                Why should this have been marked correct?
                                                <textarea
                                                    value={amendReason}
                                                    onChange={(e) => setAmendReason(e.target.value)}
                                                    required
                                                    rows={3}
                                                    className="input-field px-3 py-2 text-sm"
                                                    placeholder="Explain your reasoning..."
                                                />
                                            </label>

                                            {amendError && (
                                                <p className="mt-2 text-xs text-error">{amendError}</p>
                                            )}

                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => submitAmendRequest(r)}
                                                    disabled={amendSubmitting || !amendReason.trim()}
                                                    className="btn-primary px-3 py-1.5 text-xs"
                                                >
                                                    {amendSubmitting ? "Sending..." : "Send Request"}
                                                </button>
                                                <button
                                                    onClick={closeAmendForm}
                                                    disabled={amendSubmitting}
                                                    className="btn-secondary px-3 py-1.5 text-xs"
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
                <div className="card p-4">
                    {roundLabel && (
                        <span
                            className={`mb-2 badge-round px-3 py-1 ${
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
                    <p className="heading-semibold">
                        {question?.questionCategory}: {question?.questionPrompt}
                    </p>
                </div>

                {error && (
                    <p className="alert-error px-4 py-2">{error}</p>
                )}

                {/* min-h keeps this card's footprint stable across its
                    tallest state (the answer form) so switching between
                    form / "no answer" / "your answer" as gameStatus
                    changes doesn't resize the box and flash the
                    border/background on every transition. */}
                <div className="card p-6 min-h-[300px]">
                    {myResponse ? (
                        <div>
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <p className="label-caps">Your Answer</p>
                                <Verdict response={myResponse} showVerdict={isRevealed} />
                            </div>
                            <p className="mb-4 text-lg text-body">
                                {myResponse.responseAnswer}
                            </p>
                            {!isHalftime && (
                                <>
                                    <p className="label-caps">
                                        Points Wagered
                                    </p>
                                    <p className="mb-4 text-lg text-body">
                                        {myResponse.responseWager}
                                    </p>
                                </>
                            )}
                            {isRevealed && (
                                <>
                                    <p className="label-caps">
                                        Correct Answer
                                    </p>
                                    <p className="mb-4 text-lg text-body">
                                        {question?.questionAnswer ?? "—"}
                                    </p>
                                </>
                            )}
                            <p className="text-sm text-subtle">
                                {isRevealed
                                    ? "Waiting for the next question..."
                                    : answersOpen
                                        ? "Answer locked in. Waiting for the round to close..."
                                        : "Answers are closed. Waiting for the reveal..."}
                            </p>
                        </div>
                    ) : loading && !question ? (
                        <p className="text-hint">Loading question...</p>
                    ) : !answersOpen ? (
                        <div>
                            <p className="label-caps">Your Answer</p>
                            <p className="mt-2 text-lg text-muted-light">No answer submitted.</p>
                            {isRevealed && (
                                <>
                                    <p className="mt-4 label-caps">
                                        Correct Answer
                                    </p>
                                    <p className="text-lg text-body">
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
                                className="input-field px-3 py-3"
                                placeholder="Type your answer"
                            />

                            {isFinal && (
                                <label className="flex flex-col gap-1 field-label">
                                    Wager (0-15)
                                    <input
                                        type="number"
                                        min={0}
                                        max={15}
                                        value={selectedWager}
                                        onChange={(e) => setSelectedWager(e.target.value)}
                                        required
                                        className="w-24 input-field px-3 py-2"
                                    />
                                </label>
                            )}

                            {!isHalftime && !isFinal && (
                                <div className="flex flex-wrap items-center gap-4">
                                    {wagers.length === 0 ? (
                                        <p className="text-hint">No wagers available.</p>
                                    ) : (
                                        wagers.map((w) => (
                                            <label
                                                key={w}
                                                className="flex items-center gap-1.5 text-sm font-medium text-secondary"
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
                                className="btn-primary px-4 py-3 text-sm"
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