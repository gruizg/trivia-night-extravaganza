package learn.trivia.models;

public enum QuestionType {

    NORMAL("normal"),
    HALFTIME("halftime"),
    FINAL("final"),
    TIEBREAKER("tiebreaker");

    private final String name;

    QuestionType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static QuestionType findByName(String name) {
        for (QuestionType question : QuestionType.values()) {
            if (question.getName().equalsIgnoreCase(name)) {
                return question;
            }
        }
        String message = String.format("No question type with name: %s.", name);
        throw new RuntimeException(message);
    }
}