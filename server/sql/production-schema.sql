drop database if exists trivia;
create database trivia;
use trivia;

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