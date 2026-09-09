"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ThemeCard({ theme }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleClick() {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/game`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ theme: { themeId: theme.themeId } }),
            });

            if (!res.ok) throw new Error("Could not start a game for this theme.");

            const game = await res.json();
            router.push(`/lobby?gameId=${game.gameId}`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <li>
            <button
                onClick={handleClick}
                disabled={loading}
                className="flex w-full flex-col justify-between card p-6 text-left transition-all hover:shadow-md hover:border-blue-400 disabled:opacity-60"
            >
                <div>
                    {/* Title and Author Header */}
                    <div className="mb-3">
                        <h3 className="text-xl heading tracking-tight">
                            {theme.themeTitle}
                        </h3>
                        <p className="text-sm font-medium text-subtle">
                            by {theme.user.username}
                        </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-muted">
                        {theme.themeDescription}
                    </p>
                </div>

                <p className="mt-4 text-xs font-bold uppercase text-blue-600">
                    {loading ? "Starting game..." : ""}
                </p>

                {error && <p className="mt-2 text-xs text-error">{error}</p>}
            </button>
        </li>
    );
}