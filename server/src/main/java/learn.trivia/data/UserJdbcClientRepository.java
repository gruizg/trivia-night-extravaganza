package learn.trivia.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class UserJdbcClientRepository implements UserRepository {

    private final JdbcClient client;

    public UserJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }

    //TODO: IMPLEMENT

}
