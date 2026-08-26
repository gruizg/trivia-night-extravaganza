package learn.trivia.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class ThemeJdbcClientRepository implements ThemeRepository {

    private final JdbcClient client;

    public ThemeJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }
}
