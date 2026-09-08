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
        <div className="flex h-full min-h-0 flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Team Rankings
            </h2>

            {ranked.length === 0 ? (
                <p className="text-sm text-gray-400">No teams yet.</p>
            ) : (
                <ul className="flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto">
                    {ranked.map((team, index) => (
                        <li
                            key={team.teamId}
                            className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-400">#{index + 1}:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {team.teamName}(#{team.teamNumber})
                                </span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">
                                {team.score}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}