import Link from "next/link";

export default function Home() {
    return (
        <div className="marketing-page page-container overflow-y-auto p-0">
            {/* Hero */}
            <section className="rounded-t-[10px] bg-[var(--tn-ink)] px-6 py-16 sm:px-12 sm:py-20">
                <p className="text-sm font-bold uppercase tracking-wide text-[var(--tn-gold)]">
                    Six rounds. One crown.
                </p>
                <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-[var(--tn-cream)] sm:text-6xl">
                    Trivia Night Extravaganza
                </h1>
                <p className="mt-6 max-w-xl text-lg text-[var(--tn-cream)]/80">
                    Are you the biggest brainiac in the room? Do you have the instincts of a
                    knowledgeable ninja? Gather your friends and family and find out who
                    really knows it all — and who's just been faking it since round two.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        href="/themes"
                        className="rounded-lg bg-[var(--tn-gold)] px-6 py-3 text-sm font-bold text-[var(--tn-ink)] hover:brightness-95"
                    >
                        Host a Game
                    </Link>
                    <Link
                        href="/lobby"
                        className="rounded-lg border border-[var(--tn-cream)]/30 px-6 py-3 text-sm font-bold text-[var(--tn-cream)] hover:bg-[var(--tn-cream)]/10"
                    >
                        Join a Game
                    </Link>
                </div>
            </section>

            {/* How a night works */}
            <section className="px-6 py-12 sm:px-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    How a night works
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                        <p className="text-sm font-bold text-[var(--tn-pink)]">1. Pick a theme</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            From anime marathons to hometown history — grab one from the Themes
                            page, or build your own.
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[var(--tn-pink)]">2. Gather your crew</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            Share the game code, form teams, and let the trash talk begin
                            before the first question even loads.
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[var(--tn-pink)]">3. Battle for the crown</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            Twenty questions, wagers on the line. Highest
                            score at the end takes the title.
                        </p>
                    </div>
                </div>
            </section>

            {/* Teaser strip */}
            <section className="flex flex-col gap-4 border-t border-gray-200 px-6 py-8 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between sm:px-12">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Curious where this whole thing came from?
                </p>
                <div className="flex gap-4 text-sm font-bold">
                    <Link href="/about" className="text-[var(--tn-pink)] hover:underline">
                        Read the origin story
                    </Link>
                    <Link href="/rules" className="text-[var(--tn-pink)] hover:underline">
                        Check the rules
                    </Link>
                </div>
            </section>
        </div>
    );
}
