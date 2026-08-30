package learn.trivia.data.doubles;

import learn.trivia.data.ThemeRepository;
import learn.trivia.models.Theme;

import java.util.ArrayList;
import java.util.List;

public class ThemeRepositoryDouble implements ThemeRepository {

    ArrayList<Theme> themes = new ArrayList<>();

    public ThemeRepositoryDouble() {
    }

    @Override
    public Theme findById(int themeId) {
        return null;
    }

    @Override
    public List<Theme> findAll() {
        return List.of();
    }

    //TODO: IMPLEMENT DOUBLE

}