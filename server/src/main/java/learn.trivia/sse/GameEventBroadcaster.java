package learn.trivia.sse;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Holds one long-lived SseEmitter per connected client, grouped by gameId,
 * and pushes server-side changes out to every client currently watching that
 * game. This replaces the previous approach of the frontend polling REST
 * endpoints on a timer and re-fetching whole objects to notice changes.
 *
 * Services call broadcast(...) right after a mutation succeeds; controllers
 * only expose the subscribe endpoint that hands a browser its emitter.
 */
@Component
public class GameEventBroadcaster {

    // Comfortably longer than a single trivia game session; short enough
    // that abandoned connections eventually get cleaned up if a client
    // disappears without closing cleanly.
    private static final long EMITTER_TIMEOUT_MS = 30 * 60 * 1000L;

    private final Map<Integer, List<SseEmitter>> emittersByGame = new ConcurrentHashMap<>();

    public SseEmitter subscribe(int gameId) {
        SseEmitter emitter = new SseEmitter(EMITTER_TIMEOUT_MS);
        List<SseEmitter> emitters = emittersByGame.computeIfAbsent(gameId, id -> new CopyOnWriteArrayList<>());
        emitters.add(emitter);

        emitter.onCompletion(() -> remove(gameId, emitter));
        emitter.onTimeout(() -> remove(gameId, emitter));
        emitter.onError(e -> remove(gameId, emitter));

        try {
            // Send an initial event so the browser's EventSource has
            // something to fire immediately instead of sitting silent
            // until the next real update.
            emitter.send(SseEmitter.event().name("connected").data(gameId, MediaType.APPLICATION_JSON));
        } catch (IOException e) {
            remove(gameId, emitter);
        }

        return emitter;
    }

    public void broadcast(int gameId, String eventName, Object payload) {
        List<SseEmitter> emitters = emittersByGame.get(gameId);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(payload, MediaType.APPLICATION_JSON));
            } catch (IOException | IllegalStateException e) {
                remove(gameId, emitter);
            }
        }
    }

    private void remove(int gameId, SseEmitter emitter) {
        List<SseEmitter> emitters = emittersByGame.get(gameId);
        if (emitters != null) {
            emitters.remove(emitter);
            if (emitters.isEmpty()) {
                emittersByGame.remove(gameId);
            }
        }
    }
}
