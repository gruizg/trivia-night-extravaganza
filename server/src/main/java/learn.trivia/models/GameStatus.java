package learn.trivia.models;

public enum GameStatus {
    LOBBY("lobby"),
    QUESTION("question"),
    REVIEW("review"),
    RANKING("ranking");

    private final String name;

    GameStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static GameStatus findByName(String name) {
        for (GameStatus status : GameStatus.values()) {
            if (status.getName().equalsIgnoreCase(name)) {
                return status;
            }
        }
        String message = String.format("No game status with name: %s.", name);
        throw new RuntimeException(message);
    }
}
