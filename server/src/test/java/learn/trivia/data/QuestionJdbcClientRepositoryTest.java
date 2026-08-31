package learn.trivia.data;

import learn.trivia.models.Question;
import learn.trivia.models.QuestionType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static learn.trivia.TestDataHelpers.Models.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class QuestionJdbcClientRepositoryTest {

    @Autowired
    QuestionJdbcClientRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    //TODO: IMPLEMENT TESTS

    @Nested
    class Read {

        @Test
        void shouldFindById() {
            Question question = repository.findById(1);

            assertNotNull(question);
            assertEquals("category", question.getQuestionCategory());
            assertEquals("question", question.getQuestionPrompt());
            assertEquals("answer", question.getQuestionAnswer());
            assertEquals(QuestionType.NORMAL, question.getQuestionType());
            assertEquals(1, question.getQuestionRound());
            assertEquals(1, question.getQuestionOrder());
            assertEquals(makeTheme(), question.getTheme());
        }

        @Test
        void shouldFindByThemeId() {
            List<Question> questions = repository.findByThemeId(1);

            assertNotNull(questions);
            assertEquals(2, questions.size());
        }
    }
}