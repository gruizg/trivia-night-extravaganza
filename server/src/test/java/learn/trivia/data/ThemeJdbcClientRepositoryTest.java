package learn.trivia.data;

import static learn.trivia.TestDataHelpers.Models.*;
import learn.trivia.models.Theme;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class ThemeJdbcClientRepositoryTest {

    @Autowired
    ThemeJdbcClientRepository repository;

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
            Theme theme = repository.findById(1);

            assertNotNull(theme);
            assertEquals("title", theme.getThemeTitle());
            assertEquals("description", theme.getThemeDescription());
            assertEquals(makeExistingUser(), theme.getUser());
        }

        @Test
        void shouldFindAll() {

            List<Theme> themes = repository.findAll();

            assertNotNull(themes);
            assertEquals(2, themes.size());
        }
    }
}