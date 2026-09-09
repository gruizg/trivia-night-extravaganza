use trivia;

INSERT INTO user (username, email, password)
VALUES ('admin', 'email', 'hashed-password');

INSERT INTO theme (theme_title, theme_description, user_id)
VALUES ('Dragon Ball Trivia', 'Do you know BALL? Prove you''re the ultimate Z fighter against this super saiyan level trivia', 1);

INSERT INTO question (question_category, question_prompt, question_answer, question_type, question_round, question_order, theme_id)
VALUES
    -- Round 1
    ('Martial Arts Masters', 'What is the name of Goku''s original martial arts master who taught him the Kamehameha?', 'Master Roshi', 'normal', 1, 1, 1),
    ('Capsule Corp Tech', 'What invention does Bulma create to track down the seven wish-granting orbs?', 'Dragon Radar', 'normal', 1, 2, 1),
    ('Extraterrestrial Origins', 'What warrior race is Goku revealed to belong to at the start of Dragon Ball Z?', 'Saiyan', 'normal', 1, 3, 1),

    -- Round 2
    ('Secret Identities', 'What is Goku''s birth name assigned to him on Planet Vegeta?', 'Kakarot', 'normal', 2, 1, 1),
    ('Galactic Tyrants', 'Which villain is responsible for the destruction of Planet Namek?', 'Frieza', 'normal', 2, 2, 1),
    ('Deity Techniques', 'What multiplier technique did Goku learn from King Kai while dead?', 'Kaioken', 'normal', 2, 3, 1),

    -- Round 3
    ('From Beyond', 'Which warrior travels from the future to warn the Z Fighters about the deadly Androids?', 'Trunks', 'normal', 3, 1, 1),
    ('Gero''s Monsters', 'Besides Cell, which android must also absorb other androids to achieve a powerful form?', 'Android 13', 'normal', 3, 2, 1),
    ('Ascended Warriors', 'Who is the original legendary warrior to first transform into a Super Saiyan?', 'Yamoshi', 'normal', 3, 3, 1),

    -- Halftime
    ('Survivors', 'Besides Goku, Vegeta, Nappa, and Raditz, name four other surviving Saiyans in the animated series/movies.', 'Turles, Tarble, Broly, Paragus', 'halftime', 0, 1, 1),

    -- Round 4
    ('Magic?', 'Which evil wizard created Majin Buu?', 'Bibidi', 'normal', 4, 1, 1),
    ('Retcons', 'As of the current canon, why did Goku and Vegeta defuse when trapped inside Majin Buu?', 'Potara fusion is time-limited for non-Supreme Kais (or Buu''s magic energy/gas)', 'normal', 4, 2, 1),
    ('All in', 'What ultimate attack has only successfully defeated a main villain once for Goku?', 'Spirit Bomb', 'normal', 4, 3, 1),

    -- Round 5
    ('Gods', 'What is the underlying naming pun theme shared by all the Gods of Destruction?', 'Types of alcohol', 'normal', 5, 1, 1),
    ('Music', 'Which Japanese composer for Dragon Ball was fired after plagiarizing music from popular works like James Cameron''s Avatar and Earth, Wind & Fire?', 'Kenji Yamamoto', 'normal', 5, 2, 1),
    ('Voice Acting', 'Who has voiced Goku, Gohan, and Goten in the Japanese version of the anime ever since the original series?', 'Masako Nozawa', 'normal', 5, 3, 1),

    -- Round 6
    ('Secret Identity', 'What crime-fighting alter ego does Gohan adopt while attending Orange Star High School?', 'Great Saiyaman', 'normal', 6, 1, 1),
    ('Weaponry', 'What magical weapon given to Goku by Master Roshi can extend to infinite lengths?', 'Power Pole (Nyoibo)', 'normal', 6, 2, 1),
    ('Canonical Movies', 'Which movie was the first official canon film in the Dragon Ball Super series?', 'Dragon Ball Super: Broly', 'normal', 6, 3, 1),

    -- Final Trivia
    ('Production Lore', 'Before Akira Toriyama settled on the name "Dragon Ball", what classic 16th-century Chinese novel served as the primary structural inspiration for Goku''s origins and early adventures?', 'Journey to the West (Xi You Ji)', 'final', 7, 1, 1);