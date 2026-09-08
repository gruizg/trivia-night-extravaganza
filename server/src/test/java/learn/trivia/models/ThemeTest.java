package learn.trivia.models;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static learn.trivia.TestDataHelpers.Models.*;

class ThemeTest {

    @Test
    void shouldCorrectlyInitializeFields() {
        Theme theme = makeExistingTheme();

        assertEquals(1, theme.getThemeId());
        assertEquals("title", theme.getThemeTitle());
        assertEquals("description", theme.getThemeDescription());
        assertEquals(makeExistingUser(), theme.getUser());
    }

    @Test
    void shouldBeSameTheme() {
        Theme theme1 = makeExistingTheme();
        Theme theme2 = new Theme(1, "title", "description", makeExistingUser());

        assertEquals(theme1, theme2);
    }
    @Nested
    class DifferentThemes {

        @Test
        void notEqualWhenIdIsDifferent() {
            Theme theme1 = makeExistingTheme();
            Theme theme2 = makeExistingTheme();
            theme2.setThemeId(2);

            assertNotEquals(theme1, theme2);
        }

        @Test
        void notEqualWhenTitleIsDifferent() {
            Theme theme1 = makeExistingTheme();
            Theme theme2 = makeExistingTheme();
            theme2.setThemeTitle("title2");

            assertNotEquals(theme1, theme2);
        }

        @Test
        void notEqualWhenDescriptionIsDifferent() {
            Theme theme1 = makeExistingTheme();
            Theme theme2 = makeExistingTheme();
            theme2.setThemeDescription("description2");

            assertNotEquals(theme1, theme2);
        }

        @Test
        void notEqualWhenUserIsDifferent() {
            Theme theme1 = makeExistingTheme();
            Theme theme2 = makeExistingTheme();
            User user = makeExistingUser();
            user.setUserId(2);
            theme2.setUser(user);

            assertNotEquals(theme1, theme2);
        }
    }

}