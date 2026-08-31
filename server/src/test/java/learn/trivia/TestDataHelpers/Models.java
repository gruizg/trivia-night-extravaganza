package learn.trivia.TestDataHelpers;

import learn.trivia.models.*;

public class Models {

    public static User makeUser() {
        return new User(1, "user", "email", "hashed-password");
    }

    public static Theme makeTheme() {
        return new Theme(1, "title", "description", makeUser());
    }

    public static Question makeQuestion() {
        return new Question(1, "category", "prompt", "answer", QuestionType.NORMAL, 1, 1, makeTheme());
    }

    public static Game makeGame() {
        return new Game(1, "code", "token", GameStatus.LOBBY, 1, makeQuestion(), makeTheme());
    }

    public static Team makeTeam() {
        return new Team(1, "token", 1, "name", makeGame());
    }

    public static Response makeResponse() {
        return new Response(1, "answer", 1, false, 0, makeTeam(), makeQuestion());
    }
}
