-- Таблица персонажей пользователей
CREATE TABLE IF NOT EXISTS characters (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL CHECK (sport_type IN ('skate', 'rollers', 'bmx', 'scooter', 'bike')),
  riding_style TEXT NOT NULL CHECK (riding_style IN ('aggressive', 'technical', 'freestyle')),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 100),
  experience INTEGER NOT NULL DEFAULT 0,
  
  -- Характеристики
  balance INTEGER NOT NULL DEFAULT 1 CHECK (balance >= 1 AND balance <= 100),
  speed INTEGER NOT NULL DEFAULT 1 CHECK (speed >= 1 AND speed <= 100),
  courage INTEGER NOT NULL DEFAULT 1 CHECK (courage >= 1 AND courage <= 100),
  
  -- Кастомизация внешности
  body_type INTEGER NOT NULL DEFAULT 1 CHECK (body_type >= 1 AND body_type <= 5),
  hairstyle INTEGER NOT NULL DEFAULT 1 CHECK (hairstyle >= 1 AND hairstyle <= 10),
  hair_color TEXT NOT NULL DEFAULT '#000000',
  outfit_id INTEGER,
  
  -- Экономика
  kinetics INTEGER NOT NULL DEFAULT 0 CHECK (kinetics >= 0),
  premium_currency INTEGER NOT NULL DEFAULT 0 CHECK (premium_currency >= 0),
  
  -- Подписка
  is_pro BOOLEAN NOT NULL DEFAULT FALSE,
  pro_expires_at TIMESTAMP,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_level ON characters(level DESC);
CREATE INDEX IF NOT EXISTS idx_characters_experience ON characters(experience DESC);

-- Таблица трюков (справочник)
CREATE TABLE IF NOT EXISTS tricks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL CHECK (sport_type IN ('skate', 'rollers', 'bmx', 'scooter', 'bike')),
  category TEXT NOT NULL CHECK (category IN ('balance', 'spins', 'jumps', 'slides', 'flips')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('novice', 'amateur', 'pro', 'legend')),
  experience_reward INTEGER NOT NULL,
  kinetics_reward INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tricks_sport_type ON tricks(sport_type);
CREATE INDEX IF NOT EXISTS idx_tricks_category ON tricks(category);
CREATE INDEX IF NOT EXISTS idx_tricks_difficulty ON tricks(difficulty);

-- Таблица освоенных трюков
CREATE TABLE IF NOT EXISTS character_tricks (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL,
  trick_id INTEGER NOT NULL,
  confirmed_by TEXT,
  confirmed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(character_id, trick_id)
);

CREATE INDEX IF NOT EXISTS idx_character_tricks_character ON character_tricks(character_id);
CREATE INDEX IF NOT EXISTS idx_character_tricks_trick ON character_tricks(trick_id);

-- Таблица инвентаря
CREATE TABLE IF NOT EXISTS inventory_items (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('outfit', 'equipment', 'booster', 'animation')),
  item_name TEXT NOT NULL,
  item_rarity TEXT CHECK (item_rarity IN ('common', 'rare', 'epic', 'legendary')),
  stats JSONB,
  is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
  acquired_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_character ON inventory_items(character_id);
CREATE INDEX IF NOT EXISTS idx_inventory_equipped ON inventory_items(character_id, is_equipped);

-- Таблица транзакций кинетиков
CREATE TABLE IF NOT EXISTS kinetics_transactions (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'spend')),
  source TEXT NOT NULL,
  description TEXT,
  created_by TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kinetics_character ON kinetics_transactions(character_id);
CREATE INDEX IF NOT EXISTS idx_kinetics_created_at ON kinetics_transactions(created_at DESC);

-- Таблица таблиц лидеров
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL,
  leaderboard_type TEXT NOT NULL CHECK (leaderboard_type IN ('daily', 'seasonal', 'sport', 'age')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  metadata JSONB,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(character_id, leaderboard_type, period_start)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_type_period ON leaderboard_entries(leaderboard_type, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard_entries(leaderboard_type, rank);

-- Таблица друзей
CREATE TABLE IF NOT EXISTS friendships (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL,
  friend_character_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(character_id, friend_character_id),
  CHECK(character_id != friend_character_id)
);

CREATE INDEX IF NOT EXISTS idx_friendships_character ON friendships(character_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);

-- Таблица кланов
CREATE TABLE IF NOT EXISTS clans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  leader_character_id INTEGER NOT NULL,
  max_members INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица членов кланов
CREATE TABLE IF NOT EXISTS clan_members (
  id SERIAL PRIMARY KEY,
  clan_id INTEGER NOT NULL,
  character_id INTEGER NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('leader', 'member')) DEFAULT 'member',
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(character_id)
);

CREATE INDEX IF NOT EXISTS idx_clan_members_clan ON clan_members(clan_id);
CREATE INDEX IF NOT EXISTS idx_clan_members_character ON clan_members(character_id);

-- Таблица достижений
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  reward_kinetics INTEGER NOT NULL DEFAULT 0,
  reward_item_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица полученных достижений
CREATE TABLE IF NOT EXISTS character_achievements (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL,
  achievement_id INTEGER NOT NULL,
  earned_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(character_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_character_achievements_character ON character_achievements(character_id);

-- Таблица ежедневных заданий
CREATE TABLE IF NOT EXISTS daily_quests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  reward_kinetics INTEGER NOT NULL,
  reward_experience INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица прогресса заданий
CREATE TABLE IF NOT EXISTS character_quests (
  id SERIAL PRIMARY KEY,
  character_id INTEGER NOT NULL,
  quest_id INTEGER NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  quest_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMP,
  UNIQUE(character_id, quest_id, quest_date)
);

CREATE INDEX IF NOT EXISTS idx_character_quests_character ON character_quests(character_id, quest_date);