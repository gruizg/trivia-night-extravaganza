import Link from "next/link";

export default function Home() {
    return (
        <div className="page-container flex flex-col justify-between overflow-hidden p-6 sm:p-10">
            {/* Hero Section */}
            <section className="p-8 sm:p-12 flex flex-col items-start justify-center">
                <span className="label-caps-accent mb-2">Six rounds. One crown.</span>
                <h1 className="heading text-4xl sm:text-6xl mb-4">
                    Trivia Night Extravaganza
                </h1>
                <p className="text-secondary text-base sm:text-lg max-w-2xl mb-8">
                    Are you the biggest brainiac in the room? Do you have the instincts of a
                    knowledgeable ninja? Gather your friends and family and find out who
                    really knows it all — and who's just been faking it since round two.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                    <Link href="/themes" className="btn-primary px-8 py-3 text-lg">
                        Host a Game
                    </Link>
                    <Link href="/lobby" className="btn-secondary px-8 py-3 text-lg">
                        Join a Game
                    </Link>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-4">
                <h2 className="heading text-xl mb-4">How a night works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-4">
                        <p className="label-caps-accent mb-1">1. Pick a theme</p>
                        <p className="text-muted text-sm">
                            From anime marathons to hometown history — grab one from the Themes page.
                        </p>
                    </div>
                    <div className="p-4">
                        <p className="label-caps-accent mb-1">2. Gather your crew</p>
                        <p className="text-muted text-sm">
                            Share the game code, form teams, and let the trash talk begin early.
                        </p>
                    </div>
                    <div className="p-4">
                        <p className="label-caps-accent mb-1">3. Battle for the crown</p>
                        <p className="text-muted text-sm">
                            Twenty questions, wagers on the line. Highest score takes the title.
                        </p>
                    </div>
                </div>
            </section>

            {/* Teaser Footer Strip */}
            <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-[#ff1493]">
                <p className="text-muted text-sm">
                    Curious where this whole thing came from?
                </p>
                <div className="flex gap-6 text-sm">
                    <Link href="/about" className="btn-link">
                        Read the origin story
                    </Link>
                    <Link href="/rules" className="btn-link">
                        Check the rules
                    </Link>
                </div>
            </section>
        </div>
    );
}
