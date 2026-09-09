package learn.trivia.models;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static learn.trivia.TestDataHelpers.Models.*;

class UserTest {

    @Test
    void shouldCorrectlyInitializeFields() {
        User user = makeExistingUser();

        assertEquals(1, user.getUserId());
        assertEquals("user", user.getUsername());
        assertEquals("email", user.getEmail());
        assertEquals("hashed-password", user.getPassword());
    }

    @Test
    void shouldBeTheSameUser() {
        User user1 = makeExistingUser();
        User user2 = new User(1, "user", "email", "hashed-password");

        assertEquals(user1, user2);
    }

    @Nested
    class DifferentUsers {

        @Test
        void notEqualWhenIdIsDifferent() {
            User user1 = makeExistingUser();
            User user2 = makeExistingUser();
            user2.setUserId(2);

            assertNotEquals(user1, user2);
        }

        @Test
        void notEqualWhenUsernameIsDifferent() {
            User user1 = makeExistingUser();
            User user2 = makeExistingUser();
            user2.setUsername("user2");

            assertNotEquals(user1, user2);
        }

        @Test
        void notEqualWhenEmailIsDifferent() {
            User user1 = makeExistingUser();
            User user2 = makeExistingUser();
            user2.setEmail("email2");

            assertNotEquals(user1, user2);
        }

        @Test
        void notEqualWhenPasswordIsDifferent() {
            User user1 = makeExistingUser();
            User user2 = makeExistingUser();
            user2.setPassword("hashed-password2");

            assertNotEquals(user1, user2);
        }
    }

}