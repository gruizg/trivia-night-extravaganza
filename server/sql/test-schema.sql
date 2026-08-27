drop database if exists trivia_test;
create database trivia_test;
use trivia_test;

create table `user` (
                        user_id int primary key auto_increment,
                        username text not null,
                        email text not null,
                        password text not null
);

create table theme (
                       theme_id        int primary key auto_increment,
                       thm_title       text not null,
                       thm_description text,
                       user_id         int  null,
                       constraint fk_theme_user
                           foreign key (user_id)
                               references user (user_id)
                               on delete cascade
                               on update cascade
);

create table question (
                          question_id int primary key auto_increment,
                          qstn_category text not null,
                          qstn_prompt text not null,
                          qstn_answer text not null,
                          qstn_type text not null,
                          qstn_round int not null,
                          qstn_order int not null,
                          theme_id int not null,
                          constraint fk_question_theme
                              foreign key (theme_id)
                                  references theme(theme_id)
                                  on delete cascade
                                  on update cascade
);

create table game (
                      game_id int primary key auto_increment,
                      game_code text not null,
                      host_token text not null,
                      game_status text,
                      current_round int,
                      current_question int,
                      theme_id int null,
                      constraint fk_theme_game
                          foreign key (theme_id)
                              references theme(theme_id)
                              on delete set null
                              on update cascade
);

create table team (
                      team_id int primary key auto_increment,
                      team_token text not null,
                      team_number int not null,
                      team_name text not null,
                      game_id int null ,
                      constraint fk_team_game
                          foreign key (game_id)
                              references game(game_id)
                              on delete set null
                              on update cascade
);

create table response (
                          response_id int primary key auto_increment,
                          rsp_answer text,
                          rsp_wager int,
                          rsp_correct boolean,
                          rsp_points int,
                          team_id int not null,
                          question_id int not null,
                          constraint fk_response_team
                              foreign key (team_id)
                                  references team(team_id)
                                  on delete cascade
                                  on update cascade,
                          constraint fk_response_question
                              foreign key (question_id)
                                  references question(question_id)
                                  on delete cascade
                                  on update cascade
);

delimiter //
create procedure set_known_good_state()
begin

    delete from response;
    alter table response auto_increment = 1;
    delete from question;
    alter table question auto_increment = 1;
    delete from theme;
    alter table theme auto_increment = 1;
    delete from team;
    alter table team auto_increment = 1;
    delete from game;
    alter table game auto_increment = 1;
    delete from theme;
    alter table theme auto_increment = 1;
    delete from user;
    alter table user auto_increment = 1;

    INSERT INTO user (username, email, password)
    VALUES ('user', 'email', 'hashed-password');

    INSERT INTO theme (thm_title, thm_description, user_id)
    VALUES ('General Knowledge & Trivia Night', 'A standard 6-round trivia game with halftime and final questions.', 1);

    INSERT INTO question (qstn_category, qstn_prompt, qstn_answer, qstn_type, qstn_round, qstn_order, theme_id)
    VALUES ('Science', 'What planet is known as the Red Planet?', 'Mars', 'normal', 1, 1, 1),
           ('Science', 'What gas do plants absorb from the atmosphere for photosynthesis?', 'Carbon Dioxide', 'normal', 1, 2, 1),
           ('Science', 'What is the hardest natural substance on Earth?', 'Diamond', 'normal', 1, 3, 1),

           ('Geography', 'What is the capital city of France?', 'Paris', 'normal', 2, 1, 1),
           ('Geography', 'Which ocean is the largest on Earth?', 'Pacific Ocean', 'normal', 2, 2, 1),
           ('Geography', 'Which country has the most natural lakes?', 'Canada', 'normal', 2, 3, 1),

           ('History', 'In which year did the Titanic sink?', '1912', 'normal', 3, 1, 1),
           ('History', 'Who was the first President of the United States?', 'George Washington', 'normal', 3, 2, 1),
           ('History', 'Which ancient civilization built the Machu Picchu complex?', 'Inca', 'normal', 3, 3, 1),

           ('General Knowledge', 'Name the 4 primary colors in the RYB color model along with green.', 'Red, Yellow, Blue, Green', 'halftime', 0, 1, 1),

           ('Pop Culture', 'Which movie won the first Academy Award for Best Picture?', 'Wings', 'normal', 4, 1, 1),
           ('Pop Culture', 'What is the highest-grossing animated film of all time?', 'Inside Out 2', 'normal', 4, 2, 1),
           ('Pop Culture', 'Which band performed the song "Bohemian Rhapsody"?', 'Queen', 'normal', 4, 3, 1),

           ('Literature', 'Who wrote the play "Romeo and Juliet"?', 'William Shakespeare', 'normal', 5, 1, 1),
           ('Literature', 'What is the main character''s name in "Moby-Dick"?', 'Ishmael', 'normal', 5, 2, 1),
           ('Literature', 'How many novels are in the main "Harry Potter" series?', '7', 'normal', 5, 3, 1),

           ('Sports', 'How many players are on the field for one team in soccer?', '11', 'normal', 6, 1, 1),
           ('Sports', 'Which country hosted the 2016 Summer Olympics?', 'Brazil', 'normal', 6, 2, 1),
           ('Sports', 'In chess, which piece can only move diagonally?', 'Bishop', 'normal', 6, 3, 1),

           ('Mixed Knowledge', 'Which chemical element has the symbol "Au" on the periodic table?', 'Gold', 'final', 7, 1, 1);

end //
delimiter ;