
CREATE TABLE IF NOT EXISTS character_notifications (
    id SERIAL PRIMARY KEY,
    character_id INTEGER NOT NULL REFERENCES characters(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_char_notif_character ON character_notifications(character_id);
CREATE INDEX idx_char_notif_unread ON character_notifications(character_id, is_read) WHERE is_read = false;

CREATE TABLE IF NOT EXISTS game_results (
    id SERIAL PRIMARY KEY,
    character_id INTEGER NOT NULL REFERENCES characters(id),
    game_name TEXT NOT NULL,
    won BOOLEAN NOT NULL DEFAULT false,
    earned_xp INTEGER NOT NULL DEFAULT 0,
    earned_kinetics INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_game_results_character ON game_results(character_id);

ALTER TABLE characters ADD COLUMN IF NOT EXISTS games_won INTEGER NOT NULL DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS games_played INTEGER NOT NULL DEFAULT 0;
