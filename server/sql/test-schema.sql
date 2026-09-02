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
                       theme_title       text not null,
                       theme_description text,
                       user_id         int  null,
                       constraint fk_theme_user
                           foreign key (user_id)
                               references user (user_id)
                               on delete cascade
                               on update cascade
);

create table question (
                          question_id int primary key auto_increment,
                          question_category text not null,
                          question_prompt text not null,
                          question_answer text not null,
                          question_type text not null,
                          question_round int not null,
                          question_order int not null,
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
                      current_round int null,
                      current_question_id int null,
                      theme_id int null,
                      constraint fk_game_theme
                          foreign key (theme_id)
                              references theme(theme_id)
                              on delete set null
                              on update cascade,

                      constraint fk_game_question
                          foreign key (current_question_id)
                              references question(question_id)
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
            on update cascade,
    constraint uq_game_team_number
                  unique (game_id, team_number)

);

create table response (
                          response_id int primary key auto_increment,
                          response_answer text,
                          response_wager int,
                          response_correct boolean,
                          response_points int,
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

    INSERT INTO theme (theme_title, theme_description, user_id)
    VALUES ('title', 'description', 1),
           ('Title 2', 'Description 2', 1);

    INSERT INTO question (question_category, question_prompt, question_answer, question_type, question_round, question_order, theme_id)
    VALUES ('category', 'prompt', 'answer', 'normal', 1, 1, 1),
           ('Category 2', 'Question 2', 'Answer 2', 'normal', 1, 2, 1),
           ('Category 1', 'Question 3', 'Answer 3', 'halftime', 1, 1, 2);

    INSERT INTO game(game_code, host_token, game_status, current_round, current_question_id, theme_id)
    values ('code', 'token', 'lobby', 1, 1, 1);

    insert into team(team_token, team_number, team_name, game_id)
    VALUES ('token', 1, 'name', 1),
           ('token 2', 2, 'name 2', 1);


end //
delimiter ;


select * from game;