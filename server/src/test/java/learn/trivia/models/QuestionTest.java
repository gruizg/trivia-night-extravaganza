package learn.trivia.models;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static learn.trivia.TestDataHelpers.Models.*;

class QuestionTest {

    @Test
    void shouldCorrectlyInitializeFields() {
        Question question = makeQuestion();

        assertEquals(1, question.getQuestionId());
        assertEquals("category", question.getQuestionCategory());
        assertEquals("prompt", question.getQuestionPrompt());
        assertEquals("answer", question.getQuestionAnswer());
        assertEquals(QuestionType.NORMAL, question.getQuestionType());
        assertEquals(1, question.getQuestionRound());
        assertEquals(1, question.getQuestionOrder());
        assertEquals(makeTheme(), question.getTheme());
    }

    @Test
    void shouldBeSameQuestion() {
        Question question1 = makeQuestion();
        Question question2 = new Question(1, "category", "prompt", "answer", QuestionType.NORMAL, 1, 1, makeTheme());

        assertEquals(question1, question2);
    }

    @Nested
    class DifferentQuestions {

        @Test
        void notEqualWhenIdIsDifferent() {
            Question question1 = makeQuestion();
            Question question2 = makeQuestion();
            question2.setQuestionId(2);

            assertNotEquals(question1, question2);
        }

        @Test
        void notEqualWhenCategoryIsDifferent() {
            Question question1 = makeQuestion();
            Question question2 = makeQuestion();
            question2.setQuestionCategory("category2");

            assertNotEquals(question1, question2);
        }

        @Test
        void notEqualWhenPromptIsDifferent() {
            Question question1 = makeQuestion();
            Question question2 = makeQuestion();
            question2.setQuestionPrompt("prompt2");

            assertNotEquals(question1, question2);
        }

        @Test
        void notEqualWhenAnswerIsDifferent() {
            Question question1 = makeQuestion();
            Question question2 = makeQuestion();
            question2.setQuestionAnswer("answer2");

            assertNotEquals(question1, question2);
        }

        @Test
        void notEqualWhenTypeIsDifferent() {
            Question question1 = makeQuestion();
            Question question2 = makeQuestion();
            question2.setQuestionType(QuestionType.HALFTIME);

            assertNotEquals(question1, question2);
        }

        @Test
        void notEqualWhenThemeIsDifferent() {
            Question question1 = makeQuestion();
            Question question2 = makeQuestion();
            Theme theme = makeTheme();
            theme.setThemeId(2);
            question2.setTheme(theme);

            assertNotEquals(question1, question2);
        }

    }

}