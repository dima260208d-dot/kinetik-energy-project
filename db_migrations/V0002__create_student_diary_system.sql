-- Пользователи системы (тренеры, ученики, директора)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('director', 'trainer', 'student', 'parent')),
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Группы/классы учеников
CREATE TABLE IF NOT EXISTS student_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    trainer_id INTEGER REFERENCES users(id),
    sport_type VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Связь ученик-группа (многие ко многим)
CREATE TABLE IF NOT EXISTS student_group_members (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    group_id INTEGER REFERENCES student_groups(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, group_id)
);

-- Планирование занятий
CREATE TABLE IF NOT EXISTS lesson_plans (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES student_groups(id),
    trainer_id INTEGER REFERENCES users(id),
    lesson_date DATE NOT NULL,
    topic VARCHAR(500) NOT NULL,
    description TEXT,
    goals TEXT,
    materials TEXT,
    status VARCHAR(50) DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Записи в дневнике (комментарии тренера о тренировке)
CREATE TABLE IF NOT EXISTS diary_entries (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    trainer_id INTEGER REFERENCES users(id),
    lesson_plan_id INTEGER REFERENCES lesson_plans(id),
    entry_date DATE NOT NULL,
    comment TEXT NOT NULL,
    homework TEXT,
    grade VARCHAR(50),
    attendance VARCHAR(50) DEFAULT 'present' CHECK (attendance IN ('present', 'absent', 'late', 'excused')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Медиа файлы (фото и видео с тренировок)
CREATE TABLE IF NOT EXISTS diary_media (
    id SERIAL PRIMARY KEY,
    diary_entry_id INTEGER REFERENCES diary_entries(id),
    media_type VARCHAR(50) NOT NULL CHECK (media_type IN ('photo', 'video')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_diary_entries_student ON diary_entries(student_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_trainer ON diary_entries(trainer_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_date ON diary_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_group ON lesson_plans(group_id);
CREATE INDEX IF NOT EXISTS idx_lesson_plans_date ON lesson_plans(lesson_date);