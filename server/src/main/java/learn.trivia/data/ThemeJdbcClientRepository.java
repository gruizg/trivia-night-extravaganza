package learn.trivia.data;

import learn.trivia.data.mappers.ThemeMapper;
import learn.trivia.models.Theme;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ThemeJdbcClientRepository implements ThemeRepository {

    private final JdbcClient client;

    public ThemeJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }

    @Override
    public Theme findById(int themeId) {

        final String sql = """
                select t.theme_id, t.theme_title, t.theme_description, t.user_id,
                       u.user_id, u.username, u.email, u.password
                from theme t
                left join user u on t.user_id = u.user_id
                where theme_id = ?;""";

        return client.sql(sql)
                .param(themeId)
                .query(new ThemeMapper())
                .optional().orElse(null);
    }

    @Override
    public List<Theme> findAll() {

        final String sql = """
                select t.theme_id, t.theme_title, t.theme_description, t.user_id,
                       u.user_id, u.username, u.email, u.password
                from theme t
                left join user u on t.user_id = u.user_id;
                """;

        return client.sql(sql)
                .query(new ThemeMapper())
                .list();

    }

    //TODO: IMPLEMENT

}
