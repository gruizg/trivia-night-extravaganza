package learn.trivia.domain;

import learn.trivia.data.doubles.QuestionRepositoryDouble;
import learn.trivia.data.doubles.ThemeRepositoryDouble;
import learn.trivia.models.Question;
import learn.trivia.models.Theme;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.List;

import static learn.trivia.TestDataHelpers.Models.*;
import static org.junit.jupiter.api.Assertions.*;

class ThemeServiceTest {

    ThemeService service;

    @BeforeEach
    void setup() { service = new ThemeService(new ThemeRepositoryDouble(), new QuestionRepositoryDouble()); }

    //TODO: IMPLEMENT TESTS

    @Nested
    class Read {

        @Test
        void shouldFindThemeById() {

            Theme expected = makeExistingTheme();

            Theme actual = service.findThemeById(1);

            assertNotNull(actual);
            assertEquals(expected, actual);
        }

        @Test
        void shouldNotFindThemeById() {

            Theme actual = service.findThemeById(99);

            assertNull(actual);
        }

        @Test
        void shouldFindAllThemes() {
            Theme expected = makeExistingTheme();

            List<Theme> actual = service.findAllThemes();

            assertNotNull(actual);
            assertFalse(actual.isEmpty());
            assertEquals(expected, actual.get(0));
            assertEquals(2, actual.size());
        }

        @Test
        void shouldFindQuestionById() {

            Question expected = makeExistingQuestion();

            Question actual = service.findQuestionById(1);

            assertNotNull(actual);
            assertEquals(expected, actual);
        }

        @Test
        void shouldNotFindQuestionById() {

            Question actual = service.findQuestionById(99);

            assertNull(actual);
        }

        @Test
        void shouldFindQuestionsByThemeId() {

            Question expected = makeExistingQuestion();

            List<Question> actual = service.findQuestionsByThemeId(1);

            assertNotNull(actual);
            assertFalse(actual.isEmpty());
            assertEquals(expected, actual.get(0));
            assertEquals(2, actual.size());
        }
    }
}