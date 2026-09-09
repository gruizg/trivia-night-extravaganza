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

INSERT INTO theme (theme_title, theme_description, user_id)
VALUES ('One Piece Trivia', 'You want to be the king of trivia? Sail the treacherous grand line and take your best shot at finding the ultimate treasure: first place!', 1);

INSERT INTO question (question_category, question_prompt, question_answer, question_type, question_round, question_order, theme_id)
VALUES  ('Straw Hat Pirates', 'Who was the first official member to join Luffy''s crew?', 'Roronoa Zoro', 'normal', 1, 1, 2),
        ('Devil Fruits', 'What type of Devil Fruit gives the user the power to transform into an element or force of nature?', 'Logia', 'normal', 1, 2, 2),
        ('East Blue', 'What is the name of the town where Gol D. Roger was born and executed?', 'Loguetown', 'normal', 1, 3, 2),

        ('Naval Warfare', 'What is the name of the Straw Hat Pirates'' first official ship?', 'Going Merry', 'normal', 2, 1, 2),
        ('Cyborgs', 'What does Franky use to power his cyborg body?', 'Cola', 'normal', 2, 2, 2),
        ('Warlords', 'Who was the first Seven Warlords of the Sea (Shichibukai) that Luffy defeated in battle?', 'Sir Crocodile', 'normal', 2, 3, 2),

        ('Swordsmanship', 'What is the name of Zoro''s signature sword style that utilizes three blades?', 'Santoryu (Three Sword Style)', 'normal', 3, 1, 2),
        ('Cyborgs', 'What does Franky use to power his cyborg body?', 'Cola', 'normal', 3, 2, 2),
        ('Musicians', 'Before joining Luffy and the Straw Hats, who was Brook''s original crew and captain?', 'Yorki and the Rumbar Pirates', 'normal', 3, 3, 2),

        ('Admirals', 'List the marine code name and translated animal meaning for each of the five Admirals (or former Admirals) shown in the series.', 'Akainu (Red Dog), Aokiji (Blue Pheasant), Kizaru (Yellow Monkey), Fujitora (Purple Tiger), Ryokugyu (Green Bull)', 'halftime', 0, 1, 2),

        ('Revolutionary Army', 'Who teaches Nico Robin Fish-Man Karate during her time with the Revolutionary Army?', 'Hack', 'normal', 4, 1, 2),
        ('Ancient Weapons', 'Which princess is the living embodiment of the Ancient Weapon Poseidon?', 'Princess Shirahoshi', 'normal', 4, 2, 2),
        ('Nobility', 'Which Celestial Dragon notably changed their worldview after being saved by Queen Otohime in the lower realm?', 'Donquixote Mjosgard', 'normal', 4, 3, 2),

        ('Biological Wonders', 'What is the highest number of children Big Mom has ever given birth to in a single delivery?', '10 (Decuplets)', 'normal', 5, 1, 2),
        ('That''s who that is?', 'What other famous character does the voice of chopper also play?', 'Pikachu', 'normal', 5, 2, 2),
        ('Not even Oda knows', 'What was the originally anticipated runtime of the story?', '5 years', 'normal', 5, 3, 2),

        ('Secret Identity', 'What is the actual real name of the Devil Fruit originally known as the Gomu Gomu no Mi?', 'Hito Hito no Mi, Model: Nika', 'normal', 6, 1, 2),
        ('Geography', 'What is the other name for the Red Line?', 'Blood Serpent', 'normal', 6, 2, 2),
        ('Recollection', 'What is the longest flashback in the series?', 'Loki''s backstory', 'normal', 6, 3, 2),

        ('Timeline', 'Excluding the two-year time skip, approximately how long has Luffy actually been a pirate at sea?', '5 to 9 months (under a year)', 'final', 0, 1, 2);

INSERT INTO theme (theme_title, theme_description, user_id)
values ('Science', '', 1);

INSERT INTO question (question_category, question_prompt, question_answer, question_type, question_round, question_order, theme_id)
VALUES  ('Atmosphere', 'Which layer of Earth''s atmosphere contains the ozone layer that absorbs harmful ultraviolet solar radiation?', 'Stratosphere', 'normal', 1, 1, 3),
        ('Geology', 'What type of rock is formed through the cooling and solidification of magma or lava?', 'Igneous', 'normal', 1, 2, 3),
        ('Oceanography', 'What is the deepest known point in the Earth''s oceans, located in the Western Pacific?', 'Challenger Deep (Mariana Trench)', 'normal', 1, 3, 3),

        ('Cellular Biology', 'Which organelle is famously known as the powerhouse of the cell because it generates ATP?', 'Mitochondria', 'normal', 2, 1, 3),
        ('Genetics', 'What double-helix molecule carries the genetic instructions for the development and functioning of living organisms?', 'DNA (Deoxyribonucleic Acid)', 'normal', 2, 2, 3),
        ('Human Anatomy', 'What is the largest organ in the human body?', 'Skin', 'normal', 2, 3, 3),

        ('Periodic Table', 'What is the most abundant chemical element in the observable universe?', 'Hydrogen', 'normal', 3, 1, 3),
        ('Chemical Reactions', 'What scale ranging from 0 to 14 is used to specify the acidity or basicity of an aqueous solution?', 'pH scale', 'normal', 3, 2, 3),
        ('States of Matter', 'What phase transition occurs when a substance transitions directly from a solid to a gas without passing through a liquid phase?', 'Sublimation', 'normal', 3, 3, 3),

        ('Element Symbols', 'Identify the chemical element for each of the single-letter periodic table symbols: K, W, and P.', 'Potassium (K), Tungsten (W), Phosphorus (P)', 'halftime', 0, 1, 3),

        ('Planetary Science', 'Which planet in our solar system has the most extensive and visible ring system?', 'Saturn', 'normal', 4, 1, 3),
        ('Stellar Physics', 'What powerful and luminous stellar explosion occurs during the last evolutionary stages of a massive star?', 'Supernova', 'normal', 4, 2, 3),
        ('The Solar System', 'What is the hottest planet in our solar system due to a dense greenhouse gas atmosphere?', 'Venus', 'normal', 4, 3, 3),

        ('Pharmacology', 'Who discovered penicillin in 1928, ushering in the era of modern antibiotics?', 'Alexander Fleming', 'normal', 5, 1, 3),
        ('Neuroscience', 'Which main structure of the brain controls balance, coordination, and posture?', 'Cerebellum', 'normal', 5, 2, 3),
        ('Immunology', 'What type of blood cells, also known as leukocytes, are responsible for fighting off infections?', 'White blood cells', 'normal', 5, 3, 3),

        ('Ecology', 'What term describes a biological interaction where both participating species benefit from the relationship?', 'Mutualism', 'normal', 6, 1, 3),
        ('Paleontology', 'In what geological era did dinosaurs dominate the Earth before their extinction event?', 'Mesozoic Era', 'normal', 6, 2, 3),
        ('Taxonomy', 'What two-word naming system invented by Carl Linnaeus gives species formal scientific names in Latin?', 'Binomial nomenclature', 'normal', 6, 3, 3),

        ('Scientific Breakthroughs', 'What revolutionized gene editing technology in 2012 by allowing precise modifications to DNA sequences using bacterial defense mechanisms?', 'CRISPR-Cas9', 'final', 0, 1, 3);