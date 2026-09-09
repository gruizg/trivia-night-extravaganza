import { Suspense } from "react";
import HostGame from "@/app/host/_components/HostGame";

export default function Host() {
    return (
        <div className={"page-container"}>
            <Suspense fallback={<p>Loading host controls...</p>}>
                <HostGame />
            </Suspense>
        </div>
    );
}