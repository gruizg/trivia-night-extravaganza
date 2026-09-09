import Link from "next/link";

export default function Play() {
    return (
        <div className="page-container flex flex-col items-center justify-center gap-10">
            <div className="text-center">
                <h1 className="heading-brand text-4xl sm:text-5xl mb-2">Ready to Play?</h1>
                <p className="text-secondary text-lg">
                    Choose whether you are setting up a new trivia room or entering an existing one.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Host Section */}
                <div className="card p-8 flex flex-col justify-between items-center text-center gap-6 hover:shadow-md hover:border-blue-400">
                    <div className="flex flex-col gap-2">
                        <h2 className="heading text-2xl">Host a Game</h2>
                        <p className="text-muted text-base">
                            Pick a trivia theme, configure game settings, and lead the trivia night for your friends.
                        </p>
                    </div>

                    <Link
                        href="/themes"
                        className="btn-primary theme-btn w-full py-5 text-2xl uppercase tracking-wider text-center transition-transform hover:scale-[1.02]"
                    >
                        Host
                    </Link>
                </div>

                {/* Join Section */}
                <div className="card p-8 flex flex-col justify-between items-center text-center hover:shadow-md hover:border-blue-400 gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="heading text-2xl">Join a Room</h2>
                        <p className="text-muted text-base">
                            Got a game code? Jump right into an active lobby, pick your team, and start answering.
                        </p>
                    </div>

                    <Link
                        href="/lobby"
                        className="btn-secondary join-btn w-full py-5 text-2xl uppercase tracking-wider text-center transition-transform hover:scale-[1.02]"
                    >
                        Join
                    </Link>
                </div>
            </div>
        </div>
    );
}