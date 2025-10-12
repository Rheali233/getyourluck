-- 详细用户反馈表（与简单 like/dislike 分离，存储结构化反馈）
CREATE TABLE IF NOT EXISTS user_feedback_details (
  id TEXT PRIMARY KEY,
  test_type TEXT NOT NULL,
  test_id TEXT,
  result_id TEXT,
  session_id TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  email TEXT,
  can_contact INTEGER NOT NULL DEFAULT 0,
  screenshot_url TEXT,
  client_ua TEXT,
  client_platform TEXT,
  client_locale TEXT,
  ip_hash TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_feedback_details_created_at ON user_feedback_details (created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_details_test_type ON user_feedback_details (test_type, created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_details_session ON user_feedback_details (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_details_category ON user_feedback_details (category, created_at);

