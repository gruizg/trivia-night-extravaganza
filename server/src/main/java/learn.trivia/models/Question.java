package learn.trivia.models;

import java.util.Objects;

public class Question {

    private int questionId;
    private String questionCategory;
    private String questionPrompt;
    private String questionAnswer;
    private QuestionType questionType;
    private int questionRound;
    private int questionOrder;
    private Theme theme;

    public Question() {}

    public Question(int questionId, String questionCategory, String questionPrompt, String questionAnswer,
                    QuestionType questionType, int questionRound, int questionOrder, Theme theme) {
        this.questionId = questionId;
        this.questionCategory = questionCategory;
        this.questionPrompt = questionPrompt;
        this.questionAnswer = questionAnswer;
        this.questionType = questionType;
        this.questionRound = questionRound;
        this.questionOrder = questionOrder;
        this.theme = theme;
    }

    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public String getQuestionCategory() {
        return questionCategory;
    }

    public void setQuestionCategory(String questionCategory) {
        this.questionCategory = questionCategory;
    }

    public String getQuestionPrompt() {
        return questionPrompt;
    }

    public void setQuestionPrompt(String questionPrompt) {
        this.questionPrompt = questionPrompt;
    }

    public String getQuestionAnswer() {
        return questionAnswer;
    }

    public void setQuestionAnswer(String questionAnswer) {
        this.questionAnswer = questionAnswer;
    }

    public QuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(QuestionType questionType) {
        this.questionType = questionType;
    }

    public int getQuestionRound() {
        return questionRound;
    }

    public void setQuestionRound(int questionRound) {
        this.questionRound = questionRound;
    }

    public int getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(int questionOrder) {
        this.questionOrder = questionOrder;
    }

    public Theme getTheme() {
        return theme;
    }

    public void setTheme(Theme theme) {
        this.theme = theme;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Question question = (Question) o;
        return questionId == question.questionId && questionRound == question.questionRound && questionOrder == question.questionOrder && Objects.equals(questionCategory, question.questionCategory) && Objects.equals(questionPrompt, question.questionPrompt) && Objects.equals(questionAnswer, question.questionAnswer) && questionType == question.questionType && Objects.equals(theme, question.theme);
    }

    @Override
    public int hashCode() {
        return Objects.hash(questionId, questionCategory, questionPrompt, questionAnswer, questionType, questionRound, questionOrder, theme);
    }
}
