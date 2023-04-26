CREATE DATABASE IF NOT EXISTS onvu;

USE onvu;

CREATE TABLE video_data (
  video_data_id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  meta_data JSON
);