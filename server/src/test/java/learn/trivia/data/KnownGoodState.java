package learn.trivia.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

@Component
public class KnownGoodState {

    @Autowired
    JdbcClient client;

    static boolean hasRun = false;

    void set() {
        client.sql("call set_known_good_state();").update();
    }
}
