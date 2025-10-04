-- InterviewAce Database Schema
-- This schema tracks user progress across aptitude tests, coding practice, and interviews

-- Users table (extends existing auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aptitude Categories
CREATE TABLE IF NOT EXISTS aptitude_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    total_questions INTEGER DEFAULT 0,
    time_limit_minutes INTEGER DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aptitude Questions
CREATE TABLE IF NOT EXISTS aptitude_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES aptitude_categories(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of options
    correct_answer INTEGER NOT NULL, -- Index of correct option
    explanation TEXT,
    difficulty_level VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
    programming_language VARCHAR(50), -- For programming questions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Aptitude Test Sessions
CREATE TABLE IF NOT EXISTS user_aptitude_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES aptitude_categories(id) ON DELETE CASCADE,
    programming_language VARCHAR(50), -- For programming category
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    time_taken_seconds INTEGER,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    score_percentage DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'in_progress' -- in_progress, completed, abandoned
);

-- User Aptitude Answers (individual question responses)
CREATE TABLE IF NOT EXISTS user_aptitude_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES user_aptitude_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES aptitude_questions(id) ON DELETE CASCADE,
    selected_answer INTEGER, -- Index of selected option (-1 for not answered)
    is_correct BOOLEAN,
    time_taken_seconds INTEGER,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coding Problem Categories
CREATE TABLE IF NOT EXISTS coding_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    total_problems INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coding Problems
CREATE TABLE IF NOT EXISTS coding_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES coding_categories(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
    problem_statement TEXT NOT NULL,
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    sample_input TEXT,
    sample_output TEXT,
    test_cases JSONB, -- Array of test cases
    time_limit_seconds INTEGER DEFAULT 30,
    memory_limit_mb INTEGER DEFAULT 256,
    tags JSONB, -- Array of tags like ["array", "sorting", "dynamic-programming"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Coding Submissions
CREATE TABLE IF NOT EXISTS user_coding_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES coding_problems(id) ON DELETE CASCADE,
    programming_language VARCHAR(50) NOT NULL,
    source_code TEXT NOT NULL,
    status VARCHAR(20) NOT NULL, -- accepted, wrong_answer, time_limit_exceeded, runtime_error, compilation_error
    execution_time_ms INTEGER,
    memory_used_kb INTEGER,
    test_cases_passed INTEGER DEFAULT 0,
    total_test_cases INTEGER DEFAULT 0,
    error_message TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Problem Progress (tracks best submission per problem)
CREATE TABLE IF NOT EXISTS user_problem_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES coding_problems(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_attempted', -- not_attempted, attempted, solved
    best_submission_id UUID REFERENCES user_coding_submissions(id),
    attempts_count INTEGER DEFAULT 0,
    first_attempted_at TIMESTAMP,
    solved_at TIMESTAMP,
    best_execution_time_ms INTEGER,
    UNIQUE(user_id, problem_id)
);

-- Interview Types
CREATE TABLE IF NOT EXISTS interview_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interview Questions
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_id UUID REFERENCES interview_types(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- behavioral, technical, system_design
    question TEXT NOT NULL,
    sample_answer TEXT,
    evaluation_criteria JSONB, -- Array of criteria to evaluate
    difficulty_level VARCHAR(20) DEFAULT 'medium',
    tags JSONB, -- Array of tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Interview Sessions
CREATE TABLE IF NOT EXISTS user_interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type_id UUID REFERENCES interview_types(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_minutes INTEGER,
    overall_rating DECIMAL(3,2), -- 1.00 to 5.00
    feedback TEXT,
    status VARCHAR(20) DEFAULT 'in_progress' -- in_progress, completed, abandoned
);

-- User Interview Responses
CREATE TABLE IF NOT EXISTS user_interview_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES user_interview_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
    response TEXT,
    rating DECIMAL(3,2), -- 1.00 to 5.00
    feedback TEXT,
    time_taken_seconds INTEGER,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Overall Progress (dashboard stats)
CREATE TABLE IF NOT EXISTS user_progress_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Aptitude Stats
    aptitude_tests_completed INTEGER DEFAULT 0,
    aptitude_total_questions_answered INTEGER DEFAULT 0,
    aptitude_correct_answers INTEGER DEFAULT 0,
    aptitude_average_score DECIMAL(5,2) DEFAULT 0,
    
    -- Coding Stats
    coding_problems_solved INTEGER DEFAULT 0,
    coding_problems_attempted INTEGER DEFAULT 0,
    coding_total_submissions INTEGER DEFAULT 0,
    coding_accepted_submissions INTEGER DEFAULT 0,
    
    -- Interview Stats
    interviews_completed INTEGER DEFAULT 0,
    interview_average_rating DECIMAL(3,2) DEFAULT 0,
    
    -- Activity Stats
    total_study_time_minutes INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- User Activity Log (for tracking daily activity and streaks)
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- aptitude_test, coding_submission, interview_session
    activity_date DATE NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    details JSONB, -- Additional activity details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, activity_type, activity_date)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_aptitude_sessions_user_id ON user_aptitude_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_aptitude_sessions_category_id ON user_aptitude_sessions(category_id);
CREATE INDEX IF NOT EXISTS idx_user_aptitude_answers_session_id ON user_aptitude_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_user_coding_submissions_user_id ON user_coding_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coding_submissions_problem_id ON user_coding_submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_user_problem_progress_user_id ON user_problem_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interview_sessions_user_id ON user_interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id_date ON user_activity_log(user_id, activity_date);

-- Insert default aptitude categories
INSERT INTO aptitude_categories (name, description, total_questions, time_limit_minutes) VALUES
('general', 'General Aptitude', 20, 20),
('verbal-reasoning', 'Verbal & Reasoning', 20, 20),
('current-affairs', 'Current Affairs & GK', 20, 20),
('technical-mcqs', 'Technical MCQs', 20, 20),
('interview', 'Interview Questions', 20, 20),
('programming', 'Programming Questions', 20, 20);

-- Insert default coding categories
INSERT INTO coding_categories (name, description) VALUES
('arrays', 'Array Problems'),
('strings', 'String Manipulation'),
('linked-lists', 'Linked List Problems'),
('trees', 'Tree and Graph Problems'),
('dynamic-programming', 'Dynamic Programming'),
('sorting-searching', 'Sorting and Searching'),
('mathematics', 'Mathematical Problems'),
('greedy', 'Greedy Algorithms');

-- Insert default interview types
INSERT INTO interview_types (name, description, duration_minutes) VALUES
('technical', 'Technical Interview', 60),
('behavioral', 'Behavioral Interview', 45),
('system-design', 'System Design Interview', 90),
('hr-round', 'HR Round', 30);