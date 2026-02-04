-- 创建数据库
CREATE DATABASE IF NOT EXISTS english_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE english_learning;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url VARCHAR(255),
  nickname VARCHAR(50),
  level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') DEFAULT 'B1',
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  icon_url VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 词汇表
CREATE TABLE IF NOT EXISTS vocabularies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  word VARCHAR(100) NOT NULL,
  phonetic VARCHAR(100),
  definition TEXT NOT NULL,
  definition_zh VARCHAR(255),
  part_of_speech VARCHAR(20),
  difficulty_level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') DEFAULT 'B1',
  category_id INT NOT NULL,
  audio_url VARCHAR(255),
  image_url VARCHAR(255),
  example_count INT DEFAULT 0,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_word (word),
  INDEX idx_category_id (category_id),
  INDEX idx_difficulty_level (difficulty_level),
  INDEX idx_is_active (is_active),
  UNIQUE KEY unique_word_category (word, category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 句子表
CREATE TABLE IF NOT EXISTS sentences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vocabulary_id INT NOT NULL,
  english_text TEXT NOT NULL,
  chinese_translation VARCHAR(500),
  audio_url VARCHAR(255),
  usage_context VARCHAR(100),
  difficulty_level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') DEFAULT 'B1',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (vocabulary_id) REFERENCES vocabularies(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_vocabulary_id (vocabulary_id),
  INDEX idx_difficulty_level (difficulty_level),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户学习进度表
CREATE TABLE IF NOT EXISTS user_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  vocabulary_id INT NOT NULL,
  status ENUM('learning', 'reviewing', 'mastered') DEFAULT 'learning',
  correct_count INT DEFAULT 0,
  wrong_count INT DEFAULT 0,
  last_reviewed_at TIMESTAMP NULL,
  next_review_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vocabulary_id) REFERENCES vocabularies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_vocab (user_id, vocabulary_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_next_review_at (next_review_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 音频文件表
CREATE TABLE IF NOT EXISTS audio_files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_size INT,
  file_type VARCHAR(20),
  duration FLOAT,
  vocabulary_id INT,
  sentence_id INT,
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vocabulary_id) REFERENCES vocabularies(id) ON DELETE SET NULL,
  FOREIGN KEY (sentence_id) REFERENCES sentences(id) ON DELETE SET NULL,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_vocabulary_id (vocabulary_id),
  INDEX idx_sentence_id (sentence_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入默认分类
INSERT INTO categories (name, description, sort_order) VALUES
('Work', 'Work-related vocabulary', 1),
('Daily Life', 'Daily life vocabulary', 2),
('Communication', 'Communication and conversation', 3),
('Business', 'Business English', 4),
('Travel', 'Travel-related vocabulary', 5),
('Health', 'Health and wellness', 6),
('Technology', 'Technology and IT', 7),
('Education', 'Education-related vocabulary', 8);

-- 创建默认管理员用户（密码: admin123）
INSERT INTO users (username, email, password_hash, nickname, role, is_active) VALUES
('admin', 'admin@example.com', '$2b$10$YourHashedPasswordHere', 'Administrator', 'admin', TRUE);
