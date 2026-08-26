package learn.trivia.controllers;

import learn.trivia.data.GameRepository;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
class GameControllerTest {

    @MockitoBean
    GameRepository gameRepository;

    @Autowired
    MockMvc mvc;

    //TODO: IMPLEMENT TESTS

}