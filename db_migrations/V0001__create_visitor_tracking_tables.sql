-- Создание таблицы для отслеживания посетителей сайта
CREATE TABLE IF NOT EXISTS visitors (
    id SERIAL PRIMARY KEY,
    visitor_uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    user_agent TEXT,
    ip_address INET,
    first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    visit_count INTEGER DEFAULT 1,
    is_registered_user BOOLEAN DEFAULT FALSE,
    user_email TEXT,
    referrer TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для детальной статистики посещений (сессии)
CREATE TABLE IF NOT EXISTS visit_sessions (
    id SERIAL PRIMARY KEY,
    visitor_id INTEGER REFERENCES visitors(id),
    session_uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    pages_visited INTEGER DEFAULT 1,
    page_views JSONB DEFAULT '[]',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    landing_page TEXT,
    exit_page TEXT,
    bounce BOOLEAN DEFAULT TRUE,
    conversion_action VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_visitors_uuid ON visitors(visitor_uuid);
CREATE INDEX IF NOT EXISTS idx_visitors_first_visit ON visitors(first_visit_at);
CREATE INDEX IF NOT EXISTS idx_visitors_last_visit ON visitors(last_visit_at);
CREATE INDEX IF NOT EXISTS idx_visitors_user_email ON visitors(user_email);
CREATE INDEX IF NOT EXISTS idx_visit_sessions_visitor_id ON visit_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visit_sessions_started_at ON visit_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_visit_sessions_uuid ON visit_sessions(session_uuid);