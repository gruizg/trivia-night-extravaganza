package learn.trivia.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class QuestionJdbcClientRepository implements QuestionRepository {

    private final JdbcClient client;

    public QuestionJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }
}
