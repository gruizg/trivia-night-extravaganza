import { Suspense } from "react";
import LobbyRouter from "@/app/lobby/_components/LobbyRouter";

export default function Lobby() {
    return (
        <div className={"page-container"}>
            <Suspense fallback={<p>Loading lobby...</p>}>
                <LobbyRouter />
            </Suspense>
        </div>
    );
}