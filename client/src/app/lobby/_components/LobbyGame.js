"use client"

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TeamRow from "@/app/lobby/_components/TeamRow";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const POLL_MS = 3000;

export default function LobbyGame() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const gameId = searchParams.get("gameId");

    const [game, setGame] = useState(null);
    const [theme, setTheme] = useState(null);
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);
    const [starting, setStarting] = useState(false);

    const loadGame = useCallback(async () => {
        if (!gameId) return;

        try {
            const res = await fetch(`${API_URL}/game/${gameId}`);
            if (!res.ok) throw new Error("Game not found");
            const gameData = await res.json();
            setGame(gameData);

            if (gameData.theme?.themeId) {
                const themeRes = await fetch(`${API_URL}/theme/${gameData.theme.themeId}`);
                if (themeRes.ok) setTheme(await themeRes.json());
            }
        } catch (err) {
            setError(err.message);
        }
    }, [gameId]);

    const loadTeams = useCallback(async () => {
        if (!gameId) return;

        try {
            const res = await fetch(`${API_URL}/team/all/${gameId}`);
            if (res.ok) setTeams(await res.json());
        } catch (err) {
            setError(err.message);
        }
    }, [gameId]);

    useEffect(() => {
        loadGame();
    }, [loadGame]);

    useEffect(() => {
        loadTeams();
        const interval = setInterval(loadTeams, POLL_MS);
        return () => clearInterval(interval);
    }, [loadTeams]);

    // Starting the game means putting it into the QUESTION state with the
    // theme's first question already loaded — otherwise the game just sits
    // in LOBBY forever, the host never sees a current question, and teams
    // never get signaled to switch into TeamGameView.
    async function startGame() {
        if (!game || starting) return;
        setStarting(true);
        setError(null);

        try {
            const qRes = await fetch(`${API_URL}/theme/question/all/${game.theme.themeId}`);
            if (!qRes.ok) throw new Error("Could not load questions for this theme.");
            const questions = await qRes.json();

            if (questions.length === 0) {
                throw new Error("This theme has no questions yet.");
            }

            // Same ordering rule HostGame uses for "Next Question": sort by
            // round/order, but pin HALFTIME between rounds 3/4 and FINAL last.
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

            const first = ordered[0];

            const res = await fetch(`${API_URL}/game/${gameId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...game,
                    gameStatus: "QUESTION",
                    currentRound: first.questionRound,
                    currentQuestion: { questionId: first.questionId },
                }),
            });

            if (!res.ok) throw new Error("Could not start the game.");

            router.push(`/host?gameId=${gameId}`);
        } catch (err) {
            setError(err.message);
            setStarting(false);
        }
    }

    if (!gameId) {
        return (
            <div>
                <h1 className="mb-4 text-2xl font-bold">Lobby</h1>
                <p className="text-gray-500">
                    No game selected. Choose a theme from the Themes page to start one.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <h1 className="mb-4 text-2xl font-bold">Lobby</h1>

            {error && (
                <p className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700">{error}</p>
            )}

            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Theme info + game code */}
                <div className="flex flex-col gap-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                            Theme Info
                        </h2>
                        {theme ? (
                            <>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {theme.themeTitle}
                                </p>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                    {theme.themeDescription}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-400">Loading theme...</p>
                        )}
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <p className="mb-2 text-sm font-bold uppercase text-gray-400">Game Code</p>
                        <p className="text-4xl font-black tracking-widest text-gray-900 dark:text-white">
                            {game?.gameCode ?? "----"}
                        </p>

                        <button
                            onClick={startGame}
                            disabled={teams.length === 0 || starting}
                            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {starting ? "Starting..." : "Start Game"}
                        </button>
                        {teams.length === 0 && (
                            <p className="mt-2 text-xs text-gray-400">
                                Waiting for at least one team to join...
                            </p>
                        )}
                    </div>
                </div>

                {/* Incoming teams */}
                <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                        Incoming Teams
                    </h2>

                    {teams.length === 0 ? (
                        <p className="text-sm text-gray-400">No teams have joined yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-3 overflow-y-auto">
                            {teams.map((team, index) => (
                                <TeamRow key={team.teamId} team={team} index={index} />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}