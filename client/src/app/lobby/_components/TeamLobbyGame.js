"use client"

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TeamRow from "@/app/lobby/_components/TeamRow";
import TeamGameView from "@/app/lobby/_components/TeamGameView";
import useGameEvents from "@/app/hooks/useGameEvents";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TeamLobbyGame() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const gameId = searchParams.get("gameId");
    const teamId = searchParams.get("teamId");

    if (!teamId) {
        return <JoinForm />;
    }

    return <WaitingRoom gameId={gameId} teamId={teamId} />;
}

// Shown when a team hasn't joined a game yet: enter a code + team name.
function JoinForm() {
    const router = useRouter();
    const [gameCode, setGameCode] = useState("");
    const [teamName, setTeamName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            const gameRes = await fetch(`${API_URL}/game/code/${gameCode.trim()}`);
            if (!gameRes.ok) throw new Error("No game found with that code.");
            const game = await gameRes.json();

            const teamRes = await fetch(`${API_URL}/team`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamName: teamName.trim(),
                    game: { gameId: game.gameId },
                }),
            });

            if (!teamRes.ok) throw new Error("Could not join the game. Try a different team name.");
            const team = await teamRes.json();

            router.push(`/lobby?gameId=${game.gameId}&teamId=${team.teamId}`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="flex h-full items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Join a Game</h1>

                <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Game Code
                    <input
                        value={gameCode}
                        onChange={(e) => setGameCode(e.target.value)}
                        required
                        className="rounded-lg border border-gray-300 px-3 py-2 text-lg uppercase tracking-widest text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder="ABCD"
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Team Name
                    <input
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                        className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder="The Trivia Titans"
                    />
                </label>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? "Joining..." : "Join Game"}
                </button>
            </form>
        </div>
    );
}

// Shown once a team has joined: waits for the host to start the game.
function WaitingRoom({ gameId, teamId }) {
    const [game, setGame] = useState(null);
    const [theme, setTheme] = useState(null);
    const [teams, setTeams] = useState([]);
    const [myTeam, setMyTeam] = useState(null);
    const [error, setError] = useState(null);
    const [started, setStarted] = useState(false);

    const loadGame = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/game/${gameId}`);
            if (!res.ok) throw new Error("Game not found");
            const gameData = await res.json();

            // A game is in its lobby until the host starts it, at which
            // point gameStatus moves off LOBBY (to QUESTION, REVIEW, etc.).
            setStarted(gameData.gameStatus !== "LOBBY");
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
        try {
            const res = await fetch(`${API_URL}/team/all/${gameId}`);
            if (res.ok) {
                const teamData = await res.json();
                setTeams(teamData);
                setMyTeam(teamData.find((t) => String(t.teamId) === String(teamId)) ?? null);
            }
        } catch (err) {
            setError(err.message);
        }
    }, [gameId, teamId]);

    useEffect(() => {
        loadGame();
    }, [loadGame]);

    useEffect(() => {
        loadTeams();
    }, [loadTeams]);

    // Pushed by the server when the host starts the game, advances to the
    // next question, or another team joins - instead of polling both
    // endpoints every few seconds.
    useGameEvents(gameId, {
        game: () => loadGame(),
        team: () => loadTeams(),
    });

    if (started && game?.currentQuestion?.questionId) {
        return (
            <TeamGameView
                teamId={teamId}
                questionId={game.currentQuestion.questionId}
                gameStatus={game.gameStatus}
                myTeam={myTeam}
            />
        );
    }

    return (
        <div className="flex h-full flex-col">
            <h1 className="mb-4 text-2xl font-bold">Lobby</h1>

            {error && (
                <p className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700">{error}</p>
            )}

            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Theme info + status */}
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
                        <p className="mb-2 text-sm font-bold uppercase text-gray-400">
                            {myTeam ? "You're in as" : "Joining as"}
                        </p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            {myTeam?.teamName ?? "..."}
                        </p>

                        <p className="mt-6 text-sm font-semibold text-gray-500">
                            Waiting for the host to start...
                        </p>
                    </div>
                </div>

                {/* Other teams in the lobby */}
                <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                        Teams in this Game
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