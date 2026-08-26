package learn.trivia.domain;

import learn.trivia.data.doubles.QuestionRepositoryDouble;
import learn.trivia.data.doubles.ThemeRepositoryDouble;

import static org.junit.jupiter.api.Assertions.*;

class ThemeServiceTest {

    ThemeService service = new ThemeService(new ThemeRepositoryDouble(), new QuestionRepositoryDouble());

}