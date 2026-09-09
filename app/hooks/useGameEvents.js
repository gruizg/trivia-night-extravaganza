"use client"

import { useEffect, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Subscribes to a game's SSE stream (GET /game/{gameId}/events) and invokes
 * the matching handler whenever the server pushes an event, instead of the
 * frontend polling REST endpoints on a timer.
 *
 * `handlers` is a map of eventName -> (parsedData) => void, e.g.
 *   useGameEvents(gameId, {
 *     game: (game) => setGame(game),
 *     team: () => loadTeams(),
 *     response: () => loadResponses(),
 *   });
 *
 * The event names correspond to what GameEventBroadcaster sends from the
 * backend: "game", "team", and "response". Handlers can be omitted for any
 * event a given page doesn't care about.
 */
export default function useGameEvents(gameId, handlers) {
    // Keep the latest handlers in a ref so the effect below doesn't need to
    // tear down and reopen the connection every time a caller passes new
    // inline functions.
    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    useEffect(() => {
        if (!gameId) return;

        const source = new EventSource(`${API_URL}/game/${gameId}/events`);
        const listeners = [];

        for (const eventName of Object.keys(handlersRef.current)) {
            const listener = (e) => {
                const handler = handlersRef.current[eventName];
                if (!handler) return;

                try {
                    handler(JSON.parse(e.data));
                } catch {
                    handler(null);
                }
            };
            source.addEventListener(eventName, listener);
            listeners.push([eventName, listener]);
        }

        return () => {
            for (const [eventName, listener] of listeners) {
                source.removeEventListener(eventName, listener);
            }
            source.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameId]);
}
