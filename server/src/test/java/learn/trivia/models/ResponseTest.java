package learn.trivia.models;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static learn.trivia.TestDataHelpers.Models.*;

class ResponseTest {

    @Test
    void shouldCorrectlyInitializeFields() {
        Response response = makeResponse();

        assertEquals(1, response.getResponseId());
        assertEquals("answer", response.getResponseAnswer());
        assertEquals(1, response.getResponseWager());
        assertFalse(response.isResponseCorrect());
        assertEquals(0, response.getResponsePoints());
        assertEquals(makeTeam(), response.getTeam());
        assertEquals(makeQuestion(), response.getQuestion());
    }

    @Test
    void shouldBeSameResponse() {
        Response response1 = makeResponse();
        Response response2 = new Response(1, "answer", 1, false, 0, makeTeam(), makeQuestion());

        assertEquals(response1, response2);
    }

    @Nested
    class DifferentResponses {

        @Test
        void notEqualWhenIdIsDifferent() {
            Response response1 = makeResponse();
            Response response2 = makeResponse();
            response2.setResponseId(2);

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenAnswerIsDifferent() {
            Response response1 = makeResponse();
            Response response2 = makeResponse();
            response2.setResponseAnswer("answer2");

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenWagerIsDifferent() {
            Response response1 = makeResponse();
            Response response2 = makeResponse();
            response2.setResponseWager(3);

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenCorrectIsDifferent() {
            Response response1 = makeResponse();
            Response response2 = makeResponse();
            response2.setResponseCorrect(true);

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenPointsAreDifferent() {
            Response response1 = makeResponse();
            Response response2 = makeResponse();
            response2.setResponsePoints(1);

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenTeamIsDifferent() {
            Response response1 = makeResponse();
            Response response2 = makeResponse();
            Team team = makeTeam();
            team.setTeamId(2);
            response2.setTeam(team);

            assertNotEquals(response1, response2);
        }

        @Test
        void notEqualWhenQuestionIsDifferent() {
            Response response1 = makeResponse();
            Response response2 = makeResponse();
            Question question = makeQuestion();
            question.setQuestionId(2);
            response2.setQuestion(question);

            assertNotEquals(response1, response2);
        }

    }

}