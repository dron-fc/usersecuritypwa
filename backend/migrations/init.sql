BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'moderator', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO users (email, password, role)
VALUES (
  'admin@example.com',
  '$2a$12$Y9vXw7W3Y5pN6fW8qKZJl.9Jz9Jz9Jz9Jz9Jz9Jz9Jz9Jz9Jz9JzO', -- хеш пароля 'admin1234'
  'admin'
);

COMMIT;
