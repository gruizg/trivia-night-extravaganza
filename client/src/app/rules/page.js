export default function Rules() {
    return (
        <div className="marketing-page page-container overflow-y-auto">
            <p className="label-caps-accent">
                Read before you play
            </p>
            <h1 className="mt-2 text-3xl heading-brand sm:text-4xl">
                The Rules
            </h1>

            <div className="mt-8 max-w-2xl space-y-8">
                <section>
                    <h2 className="text-lg heading-brand">
                        The format
                    </h2>
                    <p className="mt-2 text-secondary">
                        There are 6 rounds - each round has 3 questions. There is also halftime and final trivia. In the event of a tie, we will also have tiebreakers.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg heading-brand">
                        Wagering
                    </h2>
                    <p className="mt-2 text-secondary">
                        For each question, choose how much you're staking on
                        it: 1, 3, or 5 points. Get it right and you bank the wager. Get it
                        wrong and it costs you nothing extra — but you don't get a
                        do-over, so choose your confidence wisely.
                    </p>
                    <p className="mt-2 text-secondary">
                        Each wager value can only be used once per question — you can't
                        stack multiple 5s on the same answer.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg heading-brand">
                        No looking it up
                    </h2>
                    <p className="mt-2 text-secondary">
                        The internet stays closed for the duration of the game. This is a
                        test of what's actually in your head, not your team's search
                        engine skills.
                    </p>
                    <p className="mt-2 text-secondary">
                        Anyone caught cheating will be publicly shamed, publicly
                        humiliated in front of their peers, and permanently banned from
                        ever playing trivia again. We don't make the rules. Actually, we
                        do. This is the rule.
                    </p>
                </section>
            </div>
        </div>
    );
}
