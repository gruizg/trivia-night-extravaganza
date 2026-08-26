package learn.trivia.domain;

import learn.trivia.data.doubles.UserRepositoryDouble;

import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {

    UserService service = new UserService(new UserRepositoryDouble());

}