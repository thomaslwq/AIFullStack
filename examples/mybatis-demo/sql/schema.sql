-- 课程示例数据库与用户表
CREATE DATABASE IF NOT EXISTS ai_fullstack
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ai_fullstack;

CREATE TABLE IF NOT EXISTS `user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `age` INT,
  `email` VARCHAR(100),
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 示例数据
INSERT INTO `user` (username, age, email) VALUES
  ('文钦', 36, 'demo@example.com'),
  ('FullStack', 28, 'fullstack@example.com'),
  ('AI Learner', 24, 'learner@example.com');
