package learn.trivia.controllers;

import learn.trivia.data.ResponseRepository;
import learn.trivia.data.TeamRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
class TeamControllerTest {

    @MockitoBean
    TeamRepository teamRepository;

    @MockitoBean
    ResponseRepository responseRepository;

    @Autowired
    MockMvc mvc;

    //TODO: IMPLEMENT TESTS

    @Test
    void check() {

    }
}