use trivia_test;

select t.theme_id, t.theme_title, t.theme_description, t.user_id,
       u.user_id, u.username, u.email, u.password
from theme t
left join user u on t.user_id = u.user_id
where theme_id = ?;

select q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
       t.theme_id, t.theme_title, t.theme_description,
       u.user_id, u.username, u.email, u.password
    from question q
left join theme t on q.theme_id = t.theme_id
left join user u on t.user_id = u.user_id
where q.question_id = ?;

select q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
       t.theme_id, t.theme_title, t.theme_description,
       u.user_id, u.username, u.email, u.password
from question q
         left join theme t on q.theme_id = t.theme_id
         left join user u on t.user_id = u.user_id;

select q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
       t.theme_id, t.theme_title, t.theme_description,
       u.user_id, u.username, u.email, u.password
from question q
         left join theme t on q.theme_id = t.theme_id
         left join user u on t.user_id = u.user_id
where t.theme_id = 1;




select t.team_id, t.team_token, t.team_number, t.team_name,
       g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
       th.theme_id, th.theme_title, th.theme_description,
       u.user_id, u.username, u.email, u.password

from team t
left join game g on t.game_id = g.game_id
left join theme th on g.theme_id = th.theme_id
left join question q on g.current_question_id = q.question_id and th.theme_id = q.theme_id
left join user u on th.user_id = u.user_id
where t.team_id = ?;

select t.team_id, t.team_token, t.team_number, t.team_name,
       g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
       th.theme_id, th.theme_title, th.theme_description,
       u.user_id, u.username, u.email, u.password

from team t
         left join game g on t.game_id = g.game_id
         left join theme th on g.theme_id = th.theme_id
         left join question q on g.current_question_id = q.question_id and th.theme_id = q.theme_id
         left join user u on th.user_id = u.user_id
where g.game_id = ?;



select g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
       th.theme_id, th.theme_title, th.theme_description,
       u.user_id, u.username, u.email, u.password

from game g
    left join theme th on g.theme_id = th.theme_id
    left join question q on g.current_question_id = q.question_id and th.theme_id = q.theme_id
    left join user u on th.user_id = u.user_id
where g.game_id = ?;

select g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
       th.theme_id, th.theme_title, th.theme_description,
       u.user_id, u.username, u.email, u.password

from game g
         left join theme th on g.theme_id = th.theme_id
         left join question q on g.current_question_id = q.question_id and th.theme_id = q.theme_id
         left join user u on th.user_id = u.user_id
where g.game_code = ?;

select exists(select 1 from game where game_code = ?);

update game set
                game_status = ?,
                current_round = ?,
                current_question_id = ?
where game_id = ?;

select r.response_id, r.response_answer, r.response_wager, r.response_status, r.response_points,
       t.team_id, t.team_token, t.team_number, t.team_name,
       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
       g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
       th.theme_id, th.theme_title, th.theme_description,
       u.user_id, u.username, u.email, u.password

from response r
    left join team t on r.team_id = t.team_id
    left join question q on r.question_id = q.question_id
    left join game g on t.game_id = g.game_id
    left join theme th on g.theme_id = th.theme_id
    left join user u on th.user_id = u.user_id
where r.response_id = ?;


select r.response_id, r.response_answer, r.response_wager, r.response_status, r.response_points,
       t.team_id, t.team_token, t.team_number, t.team_name,
       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
       g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
       th.theme_id, th.theme_title, th.theme_description,
       u.user_id, u.username, u.email, u.password

from response r
         left join team t on r.team_id = t.team_id
         left join question q on r.question_id = q.question_id
         left join game g on t.game_id = g.game_id
         left join theme th on g.theme_id = th.theme_id
         left join user u on th.user_id = u.user_id
where g.game_id = ? and q.question_id = ?;


select r.response_id, r.response_answer, r.response_wager, r.response_status, r.response_points,
       t.team_id, t.team_token, t.team_number, t.team_name,
       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
       g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
       th.theme_id, th.theme_title, th.theme_description,
       u.user_id, u.username, u.email, u.password

from response r
         left join team t on r.team_id = t.team_id
         left join question q on r.question_id = q.question_id
         left join game g on t.game_id = g.game_id
         left join theme th on g.theme_id = th.theme_id
         left join user u on th.user_id = u.user_id
where t.team_id = ?;


select r.response_wager from response r
left join team t on r.team_id = t.team_id
left join question q on r.question_id = q.question_id
left join game g on t.game_id = g.game_id
where t.team_id = ? and q.question_round = ?;

update response
set response_status = ?,
    response_points = ?
where response_id = ?;


select r.response_id, r.response_answer, r.response_wager, r.response_status, r.response_points,
       t.team_id, t.team_token, t.team_number, t.team_name,
       q.question_id, q.question_category, q.question_prompt, q.question_answer, q.question_type, q.question_round, q.question_order,
       g.game_id, g.game_code, g.host_token, g.game_status, g.current_round, g.current_question_id,
       th.theme_id, th.theme_title, th.theme_description,
       u.user_id, u.username, u.email, u.password

from response r
         left join team t on r.team_id = t.team_id
         left join question q on r.question_id = q.question_id
         left join game g on t.game_id = g.game_id
         left join theme th on g.theme_id = th.theme_id
         left join user u on th.user_id = u.user_id
where r.response_id = ?;

select coalesce(sum(response.response_points), 0)
from response
where team_id = ?;

select * from response;

select exists(select 1 from team where team_name = ? and game_id = ?);

select exists(select 1 from team where team_token = ?);

select coalesce(max(team_number), 0) + 1 as next_number
from team
where game_id = :game_id

(select next_number
 from (select coalesce(max(team_number), 0) + 1 as next_number
       from team
       where game_id = :game_id) as t)