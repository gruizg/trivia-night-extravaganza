"use client"

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TeamRow from "@/app/lobby/_components/TeamRow";
import TeamGameView from "@/app/lobby/_components/TeamGameView";
import FinalRankings from "@/app/components/FinalRankings";
import useGameEvents from "@/app/hooks/useGameEvents";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Pulls the real message out of a failed response instead of guessing at
// why it failed. Falls back to a generic message only if the server didn't
// send anything usable.
async function extractErrorMessage(res, fallback) {
    try {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const data = await res.json();
            return data?.message || data?.error || fallback;
        }
        const text = await res.text();
        return text.trim() || fallback;
    } catch {
        return fallback;
    }
}

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
            if (!gameRes.ok) {
                throw new Error(await extractErrorMessage(gameRes, "No game found with that code."));
            }
            const game = await gameRes.json();

            const teamRes = await fetch(`${API_URL}/team`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamName: teamName.trim(),
                    game: { gameId: game.gameId },
                }),
            });

            if (!teamRes.ok) {
                throw new Error(await extractErrorMessage(teamRes, "Could not join the game."));
            }
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
                className="flex w-full max-w-sm flex-col gap-4 card p-8"
            >
                <h1 className="text-2xl heading">Join a Game</h1>

                <label className="flex flex-col gap-1 field-label">
                    Game Code
                    <input
                        value={gameCode}
                        onChange={(e) => setGameCode(e.target.value)}
                        required
                        className="input-field px-3 py-2 text-lg uppercase tracking-widest"
                        placeholder="ABCD"
                    />
                </label>

                <label className="flex flex-col gap-1 field-label">
                    Team Name
                    <input
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                        className="input-field px-3 py-2"
                        placeholder="The Trivia Titans"
                    />
                </label>

                {error && <p className="text-sm text-error">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-4 py-3 text-sm"
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

            // A game is in its lobby until the host actually starts it.
            // INTRO just means the host has stopped accepting new teams -
            // the game hasn't moved into a question yet, so it isn't
            // "started" until gameStatus moves past LOBBY/INTRO too.
            setStarted(gameData.gameStatus !== "LOBBY" && gameData.gameStatus !== "INTRO");
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

    // The host puts the game into "ENDED" once the FINAL question is
    // revealed and they click "End Game" - checked ahead of the
    // in-progress view below since currentQuestion (the final question)
    // is still set at that point, which would otherwise route here into
    // TeamGameView instead.
    if (game?.gameStatus === "ENDED") {
        return <FinalRankings gameId={gameId} highlightTeamId={teamId} />;
    }

    if (started && game?.currentQuestion?.questionId) {
        return (
            <TeamGameView
                teamId={teamId}
                gameId={gameId}
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
                <p className="mb-4 alert-error px-4 py-2">{error}</p>
            )}

            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Theme info + status */}
                <div className="flex flex-col gap-6">
                    <div className="card p-6">
                        <h2 className="mb-2 text-lg heading">
                            Theme Info
                        </h2>
                        {theme ? (
                            <>
                                <p className="text-xl heading-semibold">
                                    {theme.themeTitle}
                                </p>
                                <p className="mt-1 text-sm text-muted">
                                    {theme.themeDescription}
                                </p>
                            </>
                        ) : (
                            <p className="text-hint">Loading theme...</p>
                        )}
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center card p-6">
                        <p className="mb-2 label-caps">
                            {myTeam ? "You're in as" : "Joining as"}
                        </p>
                        <p className="text-3xl heading-black">
                            {myTeam?.teamName ?? "..."}
                        </p>

                        <p className="mt-6 text-sm text-subtle">
                            Waiting for the host to start...
                        </p>
                    </div>
                </div>

                {/* Other teams in the lobby */}
                <div className="flex h-full flex-col card p-6">
                    <h2 className="mb-4 text-lg heading">
                        Teams in this Game
                    </h2>

                    {teams.length === 0 ? (
                        <p className="text-hint">No teams have joined yet.</p>
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