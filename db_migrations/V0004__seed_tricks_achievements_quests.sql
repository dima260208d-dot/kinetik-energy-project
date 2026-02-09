-- Добавляем трюки для СКЕЙТА
INSERT INTO tricks (name, sport_type, category, difficulty, experience_reward, kinetics_reward, description) VALUES
('Ollie', 'skate', 'jumps', 'novice', 50, 10, 'Базовый прыжок на скейтборде'),
('Kickflip', 'skate', 'flips', 'amateur', 100, 20, 'Вращение доски вокруг продольной оси'),
('Heelflip', 'skate', 'flips', 'amateur', 100, 20, 'Вращение доски пяткой'),
('Pop Shove-It', 'skate', 'spins', 'novice', 60, 12, 'Вращение доски на 180 градусов'),
('Frontside 180', 'skate', 'spins', 'amateur', 80, 15, 'Разворот на 180 градусов лицом'),
('Backside 180', 'skate', 'spins', 'amateur', 80, 15, 'Разворот на 180 градусов спиной'),
('Boardslide', 'skate', 'slides', 'pro', 150, 30, 'Скольжение по грани центром доски'),
('50-50 Grind', 'skate', 'slides', 'pro', 150, 30, 'Скольжение на обеих подвесках'),
('Manual', 'skate', 'balance', 'novice', 40, 8, 'Баланс на задних колёсах'),
('Drop-in', 'skate', 'jumps', 'amateur', 90, 18, 'Заезд в рампу сверху')
ON CONFLICT DO NOTHING;

-- Добавляем трюки для РОЛИКОВ
INSERT INTO tricks (name, sport_type, category, difficulty, experience_reward, kinetics_reward, description) VALUES
('Basic Roll', 'rollers', 'balance', 'novice', 30, 5, 'Базовое катание на роликах'),
('T-stop', 'rollers', 'balance', 'novice', 40, 8, 'Торможение буквой T'),
('Slalom', 'rollers', 'balance', 'amateur', 70, 14, 'Объезд конусов змейкой'),
('Backward Roll', 'rollers', 'balance', 'amateur', 80, 16, 'Катание спиной вперёд'),
('Cross Step', 'rollers', 'balance', 'amateur', 60, 12, 'Перекрёстный шаг'),
('Jump 180', 'rollers', 'jumps', 'pro', 120, 25, 'Прыжок с разворотом на 180'),
('One Foot Glide', 'rollers', 'balance', 'pro', 100, 20, 'Скольжение на одной ноге'),
('Powerslide', 'rollers', 'slides', 'pro', 150, 30, 'Торможение боковым скольжением'),
('Small Ramp Drop', 'rollers', 'jumps', 'amateur', 90, 18, 'Съезд с небольшой рампы'),
('Manual on Rollers', 'rollers', 'balance', 'legend', 200, 40, 'Баланс на задних колёсах')
ON CONFLICT DO NOTHING;

-- Добавляем трюки для BMX
INSERT INTO tricks (name, sport_type, category, difficulty, experience_reward, kinetics_reward, description) VALUES
('Bunny Hop', 'bmx', 'jumps', 'novice', 50, 10, 'Базовый прыжок на BMX'),
('Manual', 'bmx', 'balance', 'novice', 60, 12, 'Баланс на заднем колесе'),
('Fakie', 'bmx', 'balance', 'amateur', 70, 14, 'Движение задом наперёд'),
('180 Spin', 'bmx', 'spins', 'amateur', 100, 20, 'Вращение на 180 градусов'),
('360 Spin', 'bmx', 'spins', 'pro', 180, 35, 'Полное вращение на 360'),
('Nose Pick', 'bmx', 'balance', 'pro', 120, 25, 'Баланс на переднем колесе на грани'),
('Tire Tap', 'bmx', 'balance', 'amateur', 80, 16, 'Касание покрышкой грани'),
('Jump Over Obstacle', 'bmx', 'jumps', 'amateur', 90, 18, 'Прыжок через препятствие'),
('Drop-in', 'bmx', 'jumps', 'pro', 150, 30, 'Заезд в рампу'),
('Small Ramp Jump', 'bmx', 'jumps', 'amateur', 100, 20, 'Прыжок с небольшой рампы')
ON CONFLICT DO NOTHING;

-- Добавляем трюки для САМОКАТА
INSERT INTO tricks (name, sport_type, category, difficulty, experience_reward, kinetics_reward, description) VALUES
('Bunny Hop', 'scooter', 'jumps', 'novice', 50, 10, 'Базовый прыжок'),
('Tailwhip', 'scooter', 'flips', 'amateur', 120, 25, 'Вращение деки вокруг руля'),
('Barspin', 'scooter', 'spins', 'amateur', 100, 20, 'Вращение руля на 360'),
('Manual', 'scooter', 'balance', 'novice', 40, 8, 'Баланс на заднем колесе'),
('180 Jump', 'scooter', 'spins', 'amateur', 90, 18, 'Прыжок с разворотом на 180'),
('No Footer', 'scooter', 'jumps', 'pro', 150, 30, 'Прыжок без ног на деке'),
('Deck Grab', 'scooter', 'jumps', 'amateur', 70, 14, 'Захват деки в прыжке'),
('Fakie', 'scooter', 'balance', 'amateur', 80, 16, 'Движение спиной вперёд'),
('Ramp Drop', 'scooter', 'jumps', 'pro', 140, 28, 'Съезд с рампы'),
('Small Air', 'scooter', 'jumps', 'novice', 60, 12, 'Небольшой прыжок')
ON CONFLICT DO NOTHING;

-- Добавляем базовые достижения
INSERT INTO achievements (name, description, icon, requirement_type, requirement_value, reward_kinetics) VALUES
('Первый шаг', 'Создай своего персонажа', '🌟', 'character_created', 1, 50),
('Первый трюк', 'Освой свой первый трюк', '🏆', 'tricks_count', 1, 100),
('Новичок', 'Освой 10 трюков', '⭐', 'tricks_count', 10, 200),
('Любитель', 'Освой 25 трюков', '🌠', 'tricks_count', 25, 500),
('Профи', 'Освой 50 трюков', '💫', 'tricks_count', 50, 1000),
('Легенда', 'Освой 100 трюков', '👑', 'tricks_count', 100, 2500),
('Уровень 10', 'Достигни 10 уровня', '🔟', 'level', 10, 300),
('Уровень 25', 'Достигни 25 уровня', '🔝', 'level', 25, 750),
('Уровень 50', 'Достигни 50 уровня', '🚀', 'level', 50, 1500),
('Максимум', 'Достигни 100 уровня', '🌌', 'level', 100, 5000),
('Ежедневная награда', 'Войди в игру 7 дней подряд', '📅', 'daily_streak', 7, 500)
ON CONFLICT (name) DO NOTHING;

-- Добавляем ежедневные задания
INSERT INTO daily_quests (name, description, quest_type, requirement_value, reward_kinetics, reward_experience) VALUES
('Ежедневный вход', 'Зайди в Kinetic Universe', 'daily_login', 1, 10, 20),
('Тренировка', 'Освой 1 новый трюк', 'tricks_daily', 1, 50, 100),
('Практика', 'Повтори 3 освоенных трюка', 'practice_tricks', 3, 30, 50),
('Социализация', 'Добавь нового друга', 'add_friend', 1, 25, 30),
('Мастер баланса', 'Прокачай характеристику "Баланс"', 'upgrade_balance', 1, 40, 80)
ON CONFLICT DO NOTHING;