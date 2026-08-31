package learn.trivia.data;

import learn.trivia.data.mappers.QuestionMapper;
import learn.trivia.models.Question;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class QuestionJdbcClientRepository implements QuestionRepository {

    private final JdbcClient client;

    public QuestionJdbcClientRepository(JdbcClient client) {
        this.client = client;
    }

    @Override
    public Question findById(int questionId) {

        final String sql = """
                select q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
                       t.theme_id, t.theme_title, t.theme_description,
                       u.user_id, u.username, u.email, u.password
                    from question q
                left join theme t on q.theme_id = t.theme_id
                left join user u on t.user_id = u.user_id
                where q.question_id = ?;""";

        return client.sql(sql)
                .param(questionId)
                .query(new QuestionMapper())
                .optional().orElse(null);
    }

    @Override
    public List<Question> findByThemeId(int themeId) {

        final String sql = """
                select q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
                       t.theme_id, t.theme_title, t.theme_description,
                       u.user_id, u.username, u.email, u.password
                from question q
                         left join theme t on q.theme_id = t.theme_id
                         left join user u on t.user_id = u.user_id
                where t.theme_id = ?;
                """;
        return client.sql(sql)
                .param(themeId)
                .query(new QuestionMapper())
                .list();
    }

    //TODO: IMPLEMENT

}
