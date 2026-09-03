package learn.trivia.domain;

import java.security.SecureRandom;
import java.util.UUID;

public class CodeGenerator {

    private final static String CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final static SecureRandom RANDOM = new SecureRandom();

    public static String generateGameCode() {
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return code.toString();
    }

    public static String generateToken() {
        return UUID.randomUUID().toString();
    }
}
