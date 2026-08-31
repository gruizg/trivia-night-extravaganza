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