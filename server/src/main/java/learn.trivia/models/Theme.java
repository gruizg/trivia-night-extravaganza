package learn.trivia.models;

import java.util.Objects;

public class Theme {

    private int themeId;
    private String themeTitle;
    private String themeDescription;
    private User user;

    public Theme() {}

    public Theme(int themeId, String themeTitle, String themeDescription, User user) {
        this.themeId = themeId;
        this.themeTitle = themeTitle;
        this.themeDescription = themeDescription;
        this.user = user;
    }

    public int getThemeId() {
        return themeId;
    }

    public void setThemeId(int themeId) {
        this.themeId = themeId;
    }

    public String getThemeTitle() {
        return themeTitle;
    }

    public void setThemeTitle(String themeTitle) {
        this.themeTitle = themeTitle;
    }

    public String getThemeDescription() {
        return themeDescription;
    }

    public void setThemeDescription(String themeDescription) {
        this.themeDescription = themeDescription;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Theme theme = (Theme) o;
        return themeId == theme.themeId && Objects.equals(themeTitle, theme.themeTitle) && Objects.equals(themeDescription, theme.themeDescription) && Objects.equals(user, theme.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(themeId, themeTitle, themeDescription, user);
    }
}
