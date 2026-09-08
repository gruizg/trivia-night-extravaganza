package learn.trivia.models;

public enum ResponseStatus {

    CORRECT("correct"),
    INCORRECT("incorrect"),
    PENDING("pending");

    private final String name;

    ResponseStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static ResponseStatus findByName(String name) {
        for (ResponseStatus status : ResponseStatus.values()) {
            if (status.getName().equalsIgnoreCase(name)) {
                return status;
            }
        }
        String message = String.format("No response status with name: %s.", name);
        throw new RuntimeException(message);
    }
}
