export default function About() {
    return (
        <div className="marketing-page page-container overflow-y-auto">
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--tn-pink)]">
                The origin story
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                It started at a bar, over Dragon Ball trivia
            </h1>

            <div className="mt-6 max-w-2xl space-y-5 text-gray-700 dark:text-gray-300">
                <p>
                    This whole thing came out of some genuinely great nights: geek trivia
                    with friends and family, where the questions were about the things we
                    actually cared about. A Dragon Ball trivia night. A One Piece night.
                    Naruto, general anime, Pokémon, Legend of Zelda — every themed night at
                    the bar had us showing up early and staying late.
                </p>
                <p>
                    And every time, the same thing happened afterward: we'd start listing
                    off all the other themes we wished they'd run next. Eventually that
                    list got long enough that it stopped being a wish list and started
                    being a project — build the thing myself, so we could run whatever
                    trivia night we wanted, whenever we wanted, with whoever we wanted to
                    beat at it.
                </p>
                <p>
                    Trivia Night Extravaganza is that project. It's built for the same
                    energy as those bar nights — competitive, a little chaotic, and full
                    of questions nobody outside your friend group would ever think to ask.
                </p>
            </div>
        </div>
    );
}
