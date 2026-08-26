package learn.trivia.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class TeamJdbcClientRepository implements TeamRepository {

    private final JdbcClient client;

    public TeamJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }
}
