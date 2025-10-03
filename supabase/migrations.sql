-- Player Tracker Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication and roles
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Players table for player profiles
CREATE TABLE players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    alias TEXT NOT NULL,
    avatar_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assets table for player assets
CREATE TABLE assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    value DECIMAL(12,2) NOT NULL,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Finance transactions table
CREATE TABLE finance_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table for task management
CREATE TABLE tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    assignee_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    percent_complete INTEGER NOT NULL DEFAULT 0 CHECK (percent_complete >= 0 AND percent_complete <= 100),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documents table for file uploads and Google Docs
CREATE TABLE documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    storage_path TEXT,
    is_google_doc BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_alias ON players(alias);
CREATE INDEX idx_assets_player_id ON assets(player_id);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_finance_transactions_player_id ON finance_transactions(player_id);
CREATE INDEX idx_finance_transactions_type ON finance_transactions(type);
CREATE INDEX idx_finance_transactions_created_at ON finance_transactions(created_at);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_user_id);
CREATE INDEX idx_documents_owner ON documents(owner_user_id);
CREATE INDEX idx_documents_player ON documents(player_id);
CREATE INDEX idx_documents_type ON documents(is_google_doc);

-- Update timestamps function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add timestamp triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can manage users" ON users
    FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Players policies
CREATE POLICY "Users can view players" ON players
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage players" ON players
    FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Assets policies
CREATE POLICY "Users can view assets" ON assets
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage assets" ON assets
    FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Finance transactions policies
CREATE POLICY "Users can view transactions" ON finance_transactions
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage transactions" ON finance_transactions
    FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Tasks policies
CREATE POLICY "Users can view tasks" ON tasks
    FOR SELECT USING (true);

CREATE POLICY "Users can update assigned tasks" ON tasks
    FOR UPDATE USING (auth.uid() = assignee_user_id);

CREATE POLICY "Admins can manage tasks" ON tasks
    FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Documents policies
CREATE POLICY "Users can view documents" ON documents
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own documents" ON documents
    FOR ALL USING (auth.uid() = owner_user_id);

CREATE POLICY "Admins can manage all documents" ON documents
    FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create views for common queries
CREATE VIEW player_summary AS
SELECT
    p.id,
    p.name,
    p.alias,
    p.avatar_url,
    p.notes,
    p.created_at,
    COUNT(a.id) as asset_count,
    COALESCE(SUM(a.value * a.quantity), 0) as total_assets_value,
    COALESCE(
        SUM(CASE WHEN ft.type = 'credit' THEN ft.amount ELSE -ft.amount END),
        0
    ) as cash_balance
FROM players p
LEFT JOIN assets a ON p.id = a.player_id
LEFT JOIN finance_transactions ft ON p.id = ft.player_id
GROUP BY p.id, p.name, p.alias, p.avatar_url, p.notes, p.created_at;

-- Create dashboard summary view
CREATE VIEW dashboard_summary AS
SELECT
    (SELECT COUNT(*) FROM players) as total_players,
    (SELECT COALESCE(SUM(value * quantity), 0) FROM assets) as total_assets_value,
    (SELECT COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END), 0) FROM finance_transactions) as total_cash_balance,
    (SELECT COUNT(*) FROM tasks WHERE status != 'done') as active_tasks,
    (SELECT COUNT(*) FROM documents) as total_documents;