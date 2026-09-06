package learn.trivia.data;

import learn.trivia.models.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static learn.trivia.TestDataHelpers.Models.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class ResponseJdbcClientRepositoryTest {

    @Autowired
    ResponseJdbcClientRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Nested
    class Read {

        @Test
        void shouldFindById() {

            Response actual = repository.findById(1);

            assertNotNull(actual);
            assertEquals(1, actual.getResponseId());
            assertEquals("answer", actual.getResponseAnswer());
            assertEquals(1, actual.getResponseWager());
            assertFalse(actual.isResponseCorrect());
            assertEquals(0, actual.getResponsePoints());
            assertEquals(makeExistingQuestion(), actual.getQuestion());
            assertEquals(makeExistingTeam(), actual.getTeam());

        }

        @Test
        void shouldNotFindWhenIdMissing() {
            Response actual = repository.findById(999);
            assertNull(actual);
        }

        @Test
        void shouldNotFindWhenGameDoesNotExist() {
            List<Response> actual = repository.findByQuestionKey(999, 1);
            assertTrue(actual.isEmpty());
        }

        @Test
        void shouldFindByQuestionKey() {
            List<Response> actual = repository.findByQuestionKey(1, 1);
            assertFalse(actual.isEmpty());
            assertEquals(2, actual.size());
        }

        @Test
        void shouldNotFindWhenQuestionDoesNotExist() {
            List<Response> actual = repository.findByQuestionKey(1, 999);
            assertTrue(actual.isEmpty());
        }

        @Test
        void shouldFindByTeamKey() {
            List<Response> actual = repository.findByTeam(1);
            assertFalse(actual.isEmpty());
            assertEquals(3, actual.size());
        }

        @Test
        void shouldNotFindWhenTeamDoesNotExist() {
            List<Response> actual = repository.findByTeam(999);
            assertTrue(actual.isEmpty());
        }

        @Test
        void shouldFindOneRemainingWager() {
            List<Integer> expected = new ArrayList<>(List.of(5));
            List<Integer> actual = repository.findAvailableWagers(1, 1);

            assertFalse(actual.isEmpty());
            assertEquals(expected, actual);
        }

        @Test
        void shouldCalculateCurrentScore() {
            assertEquals(5, repository.findScoreByTeam(1));
        }
    }

    @Nested
    class Create {

        @Test
        void shouldAdd() {
            Response expected = makeNewResponse();
            expected.setResponseId(5);

            Response actual = repository.add(makeNewResponse());

            assertNotNull(actual);
            assertEquals(expected, actual);

            assertEquals(actual, repository.findById(5));
        }

    }

    @Nested
    class Update {

        @Test
        void shouldUpdate() {
            Response expected = makeExistingResponse();
            expected.setResponseCorrect(true);
            assertTrue(repository.update(expected));

            Response actual = repository.findById(1);
            assertEquals(expected, actual);
        }

        @Test
        void shouldNotUpdate() {
            Response expected = makeExistingResponse();
            expected.setResponseId(999);

            assertFalse(repository.update(expected));
        }

    }

}