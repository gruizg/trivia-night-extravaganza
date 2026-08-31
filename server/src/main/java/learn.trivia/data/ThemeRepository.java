package learn.trivia.data;

import learn.trivia.models.Theme;

import java.util.List;

public interface ThemeRepository {

    Theme findById(int themeId);

    List<Theme> findAll();

    //TODO: IMPLEMENT

}
