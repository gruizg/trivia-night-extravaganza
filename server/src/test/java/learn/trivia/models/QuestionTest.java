package learn.trivia.models;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static learn.trivia.TestDataHelpers.Models.*;

class QuestionTest {

    @Test
    void shouldCorrectlyInitializeFields() {
        Question question = makeExistingQuestion();

        assertEquals(1, question.getQuestionId());
        assertEquals("category", question.getQuestionCategory());
        assertEquals("prompt", question.getQuestionPrompt());
        assertEquals("answer", question.getQuestionAnswer());
        assertEquals(QuestionType.NORMAL, question.getQuestionType());
        assertEquals(1, question.getQuestionRound());
        assertEquals(1, question.getQuestionOrder());
        assertEquals(makeExistingTheme(), question.getTheme());
    }

    @Test
    void shouldBeSameQuestion() {
        Question question1 = makeExistingQuestion();
        Question question2 = new Question(1, "category", "prompt", "answer", QuestionType.NORMAL, 1, 1, makeExistingTheme());

        assertEquals(question1, question2);
    }

    @Nested
    class DifferentQuestions {

        @Test
        void notEqualWhenIdIsDifferent() {
            Question question1 = makeExistingQuestion();
            Question question2 = makeExistingQuestion();
            question2.setQuestionId(2);

            assertNotEquals(question1, question2);
        }

        @Test
        void notEqualWhenCategoryIsDifferent() {
            Question question1 = makeExistingQuestion();
            Question question2 = makeExistingQuestion();
            question2.setQuestionCategory("category2");

            assertNotEquals(question1, question2);
        }

        @Test
        void notEqualWhenPromptIsDifferent() {
            Question question1 = makeExistingQuestion();
            Question question2 = makeExistingQuestion();
            question2.setQuestionPrompt("prompt2");

            assertNotEquals(question1, question2);
        }

        @Test
        void notEqualWhenAnswerIsDifferent() {
            Question question1 = makeExistingQuestion();
            Question question2 = makeExistingQuestion();
            question2.setQuestionAnswer("answer2");

            assertNotEquals(question1, question2);
        }

        @Test
        void notEqualWhenTypeIsDifferent() {
            Question question1 = makeExistingQuestion();
            Question question2 = makeExistingQuestion();
            question2.setQuestionType(QuestionType.HALFTIME);

            assertNotEquals(question1, question2);
        }

        @Test
        void notEqualWhenThemeIsDifferent() {
            Question question1 = makeExistingQuestion();
            Question question2 = makeExistingQuestion();
            Theme theme = makeExistingTheme();
            theme.setThemeId(2);
            question2.setTheme(theme);

            assertNotEquals(question1, question2);
        }

    }

}