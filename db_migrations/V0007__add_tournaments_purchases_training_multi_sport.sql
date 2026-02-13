
-- Добавляем поля age, trainer, sport_types (мульти-спорт) к characters
ALTER TABLE characters ADD COLUMN IF NOT EXISTS age integer NULL;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS trainer_name text NULL;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS sport_types text[] NOT NULL DEFAULT ARRAY[]::text[];

-- Обновляем sport_types из текущего sport_type
UPDATE characters SET sport_types = ARRAY[sport_type] WHERE sport_types = '{}' OR sport_types IS NULL;

-- Таблица купленных предметов (чтобы не покупать дважды)
CREATE TABLE IF NOT EXISTS purchased_items (
    id serial PRIMARY KEY,
    character_id integer NOT NULL REFERENCES characters(id),
    item_type text NOT NULL,
    item_value text NOT NULL,
    item_name text NOT NULL,
    cost integer NOT NULL DEFAULT 0,
    purchased_at timestamp NOT NULL DEFAULT now(),
    UNIQUE(character_id, item_type, item_value)
);

-- Еженедельные турниры
CREATE TABLE IF NOT EXISTS tournaments (
    id serial PRIMARY KEY,
    week_start date NOT NULL,
    week_end date NOT NULL,
    month_key text NOT NULL,
    status text NOT NULL DEFAULT 'active',
    entry_fee integer NOT NULL DEFAULT 100,
    created_at timestamp NOT NULL DEFAULT now(),
    UNIQUE(week_start)
);

-- Участники турнира
CREATE TABLE IF NOT EXISTS tournament_entries (
    id serial PRIMARY KEY,
    tournament_id integer NOT NULL REFERENCES tournaments(id),
    character_id integer NOT NULL REFERENCES characters(id),
    score integer NOT NULL DEFAULT 0,
    games_score integer NOT NULL DEFAULT 0,
    tricks_score integer NOT NULL DEFAULT 0,
    training_score integer NOT NULL DEFAULT 0,
    rank integer NULL,
    joined_at timestamp NOT NULL DEFAULT now(),
    UNIQUE(tournament_id, character_id)
);

-- Посещения тренировок (зачисляются админом)
CREATE TABLE IF NOT EXISTS training_visits (
    id serial PRIMARY KEY,
    character_id integer NOT NULL REFERENCES characters(id),
    visit_date date NOT NULL DEFAULT CURRENT_DATE,
    confirmed_by text NULL,
    notes text NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

-- Обновляем notification_type для поддержки новых типов
-- Добавляем поле data для хранения JSON-данных уведомления
ALTER TABLE character_notifications ADD COLUMN IF NOT EXISTS data text NULL;
