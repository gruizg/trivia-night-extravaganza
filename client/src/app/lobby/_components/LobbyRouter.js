"use client"

import { useSearchParams } from "next/navigation";
import LobbyGame from "@/app/lobby/_components/LobbyGame";
import TeamLobbyGame from "@/app/lobby/_components/TeamLobbyGame";

export default function LobbyRouter() {
    const searchParams = useSearchParams();
    const gameId = searchParams.get("gameId");
    const teamId = searchParams.get("teamId");

    // Host arrives with a gameId (from clicking a theme) and no teamId.
    // Everyone else lands here from the Join button with no params at all,
    // or after joining with gameId + teamId.
    if (gameId && !teamId) {
        return <LobbyGame />;
    }

    return <TeamLobbyGame />;
}