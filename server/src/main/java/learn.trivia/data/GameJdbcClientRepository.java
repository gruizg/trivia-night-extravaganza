package learn.trivia.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class GameJdbcClientRepository implements GameRepository {

    private final JdbcClient client;

    public GameJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }
}
