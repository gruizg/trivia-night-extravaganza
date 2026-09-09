"use client"

export default function TeamRankings({ teams }) {
    // Sort by score descending; ties keep a stable, deterministic order by
    // team number ascending. Real tiebreak rules (e.g. head-to-head on the
    // final question) can replace this comparator later.
    const ranked = [...teams].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.teamNumber - b.teamNumber;
    });

    return (
        <div className="flex h-full min-h-0 flex-col card p-6">
            <h2 className="mb-4 text-lg heading">
                Team Rankings
            </h2>

            {ranked.length === 0 ? (
                <p className="text-hint">No teams yet.</p>
            ) : (
                <ul className="flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto">
                    {ranked.map((team, index) => (
                        <li
                            key={team.teamId}
                            className="flex items-center justify-between gap-3 list-row p-3 text-sm"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-muted-light">#{index + 1}:</span>
                                <span className="text-emphasis">
                                    {team.teamName}(#{team.teamNumber})
                                </span>
                            </div>
                            <span className="heading">
                                {team.score}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}