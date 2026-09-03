package learn.trivia.TestDataHelpers;

import learn.trivia.models.*;

public class Models {

    public static User makeNewUser() {
        User user = makeExistingUser();
        user.setUserId(0);
        return user;
    }

    public static User makeExistingUser() {
        return new User(1, "user", "email", "hashed-password");
    }

    public static Theme makeNewTheme() {
        Theme theme = makeExistingTheme();
        theme.setThemeId(0);
        return theme;
    }

    public static Theme makeExistingTheme() {
        return new Theme(1, "title", "description", makeExistingUser());
    }

    public static Question makeNewQuestion() {
        Question question = makeExistingQuestion();
        question.setQuestionId(0);
        return question;
    }

    public static Question makeExistingQuestion() {
        return new Question(1, "category", "prompt", "answer", QuestionType.NORMAL, 1, 1, makeExistingTheme());
    }

    public static Game makeNewGame() {
        Game game = new Game();
        game.setTheme(makeExistingTheme());
        return game;
    }
    public static Game makeExistingGame() {
        return new Game(1, "code", "token", GameStatus.LOBBY, 1, makeExistingQuestion(), makeExistingTheme());
    }

    public static Team makeNewTeam() {
        Team team = new Team();
        team.setTeamName("new name");
        team.setGame(makeExistingGame());
        return team;
    }

    public static Team makeExistingTeam() {
        return new Team(1, "token", 1, "name", makeExistingGame());
    }

    public static Response makeNewResponse() {
        Response response = new Response();
        response.setResponseAnswer("new answer");
        response.setResponseWager(1);
        response.setTeam(makeExistingTeam());
        response.setQuestion(makeExistingQuestion());
        return response;
    }

    public static Response makeExistingResponse() {
        return new Response(1, "answer", 1, false, 0, makeExistingTeam(), makeExistingQuestion());
    }
}
