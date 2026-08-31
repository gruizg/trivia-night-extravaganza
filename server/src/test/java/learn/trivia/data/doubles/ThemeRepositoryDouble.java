package learn.trivia.data.doubles;

import learn.trivia.data.ThemeRepository;
import learn.trivia.models.*;

import java.util.ArrayList;
import java.util.List;

import static learn.trivia.TestDataHelpers.Models.makeTheme;
import static learn.trivia.TestDataHelpers.Models.makeUser;

public class ThemeRepositoryDouble implements ThemeRepository {

    ArrayList<Theme> themes = new ArrayList<>();

    public ThemeRepositoryDouble() {
        themes.add(makeTheme());
        themes.add(new Theme(2, "title 2", "description 2", makeUser()));
    }

    @Override
    public Theme findById(int themeId) {
        return themes.stream().filter(theme -> theme.getThemeId() == themeId).findFirst().orElse(null);
    }

    @Override
    public List<Theme> findAll() {
        return new ArrayList<>(themes);
    }

    //TODO: IMPLEMENT DOUBLE
}