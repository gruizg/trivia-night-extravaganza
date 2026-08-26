package learn.trivia.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class ResponseJdbcClientRepository implements ResponseRepository {

    private final JdbcClient client;

    public ResponseJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }

    //TODO: IMPLEMENT

}
