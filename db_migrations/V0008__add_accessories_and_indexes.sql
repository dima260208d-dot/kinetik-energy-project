
CREATE TABLE IF NOT EXISTS accessories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL DEFAULT '🎒',
    item_type TEXT NOT NULL DEFAULT 'accessory',
    rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    price INTEGER NOT NULL DEFAULT 100,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO accessories (name, description, icon, rarity, price) VALUES
    ('Крутая кепка', 'Стильная кепка райдера', '🧢', 'rare', 200),
    ('Стильные кроссовки', 'Топовые кроссы для трюков', '👟', 'epic', 500),
    ('Защитный шлем', 'Безопасность прежде всего', '⛑️', 'common', 300),
    ('Граффити доска', 'Кастомная доска с граффити', '🎨', 'legendary', 1000),
    ('Бустер опыта x2', 'Двойной опыт на 24 часа', '⚡', 'rare', 150),
    ('Аура неона', 'Светящаяся аура вокруг персонажа', '💫', 'epic', 750),
    ('Солнечные очки', 'Выглядишь круто', '🕶️', 'common', 100),
    ('Наушники', 'Музыка для трюков', '🎧', 'rare', 250),
    ('Браслет силы', 'Энергия для новых трюков', '💪', 'epic', 400),
    ('Огненные следы', 'Огненный эффект при катании', '🔥', 'legendary', 1200);

CREATE TABLE IF NOT EXISTS character_accessories (
    id SERIAL PRIMARY KEY,
    character_id INTEGER NOT NULL REFERENCES characters(id),
    accessory_id INTEGER NOT NULL REFERENCES accessories(id),
    is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
    purchased_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(character_id, accessory_id)
);
CREATE INDEX IF NOT EXISTS idx_char_acc_char ON character_accessories(character_id);

CREATE TABLE IF NOT EXISTS monthly_leaderboards (
    id SERIAL PRIMARY KEY,
    character_id INTEGER NOT NULL REFERENCES characters(id),
    month_start DATE NOT NULL,
    total_score INTEGER NOT NULL DEFAULT 0,
    rank INTEGER,
    UNIQUE(character_id, month_start)
);
CREATE INDEX IF NOT EXISTS idx_monthly_lb_month ON monthly_leaderboards(month_start, rank);
