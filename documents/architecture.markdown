## Data
### Models
- `Theme`
- `Question`
- `User`
- `Game`
- `Team`
- `Response`
- `QuestionType`

### Repositories
- `ThemeRepository`, `ThemeJdbcClientRepository`
    * create theme
    * get theme
    * edit theme
    * delete theme
- `QuestionRepository`, `QuestionJdbcClientRepository`
    * create question
    * get question
    * update question
    * delete question
- `UserRepository`, `UserJdbcClientRepository`
    * create user
    * get user
    * edit user
    * delete user
- `GameRepository`, `GameJdbcClientRepository`
    * create game
    * get game
    * update game
- `TeamRepository`, `TeamJdbcClientRepository`
    * create team
    * get team
- `ResponseRepository`, `ResponseJdbcClientRepository`
    * create response
    * get response
    * edit response

## Service
- `UserService`
- `ThemeService`
- `GameService`
- `TeamService`
- `Response`
- `ResultType`

## Controllers
- `UserController`
- `ThemeController`
- `GameController`
- `TeamController`
- `GlobalErrHandler`