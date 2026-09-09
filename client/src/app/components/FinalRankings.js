"use client"

import { useCallback, useEffect, useState } from "react";
import useGameEvents from "@/app/hooks/useGameEvents";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Shared "Game Over" rankings screen - fetches every team in the game and
// their total score, and (optionally) highlights one team - so the host's
// final screen and each team's own final screen can show the same
// rankings. The game is over by the time this renders, so every response's
// points count toward the total (no reveal-gating needed, unlike the
// in-game score calculations in HostGame/TeamGameView).
export default function FinalRankings({ gameId, highlightTeamId }) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadRankings = useCallback(async () => {
        if (!gameId) return;

        try {
            const teamsRes = await fetch(`${API_URL}/team/all/${gameId}`);
            if (!teamsRes.ok) throw new Error("Could not load teams.");
            const teamsData = await teamsRes.json();

            const withScores = await Promise.all(
                teamsData.map(async (team) => {
                    const respRes = await fetch(`${API_URL}/response/team/${team.teamId}`);
                    const responses = respRes.ok ? await respRes.json() : [];
                    const score = responses.reduce((sum, r) => sum + (r.responsePoints ?? 0), 0);
                    return { ...team, score };
                })
            );

            withScores.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.teamNumber - b.teamNumber;
            });

            setTeams(withScores);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [gameId]);

    useEffect(() => {
        loadRankings();
    }, [loadRankings]);

    // In case a late-arriving grade/amend lands after the game is marked
    // ended, keep the board live rather than freezing it at whatever
    // happened to be loaded first.
    useGameEvents(gameId, {
        response: () => loadRankings(),
        team: () => loadRankings(),
    });

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <h1 className="mb-2 text-3xl font-black text-gray-900 dark:text-white">
                Final Rankings
            </h1>
            <p className="mb-8 text-sm font-semibold text-gray-500">Game Over</p>

            {error && (
                <p className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700">{error}</p>
            )}

            {loading ? (
                <p className="text-sm text-gray-400">Loading final rankings...</p>
            ) : teams.length === 0 ? (
                <p className="text-sm text-gray-400">No teams played this game.</p>
            ) : (
                <ul className="flex w-full max-w-md flex-col gap-3">
                    {teams.map((team, index) => {
                        const isMe =
                            highlightTeamId && String(team.teamId) === String(highlightTeamId);
                        return (
                            <li
                                key={team.teamId}
                                className={`flex items-center justify-between gap-3 rounded-xl border p-4 shadow-sm ${
                                    isMe
                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 dark:border-blue-400 dark:bg-blue-950"
                                        : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`text-xl font-black ${
                                            index === 0 ? "text-amber-500" : "text-gray-400"
                                        }`}
                                    >
                                        #{index + 1}
                                    </span>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {team.teamName}
                                            {isMe && (
                                                <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold uppercase text-white">
                                                    You
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-400">Team {team.teamNumber}</p>
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    {team.score}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
