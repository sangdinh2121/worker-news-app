CREATE DATABASE IF NOT EXISTS worker_news
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE worker_news;

CREATE TABLE IF NOT EXISTS categories (
    slug VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(180) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content LONGTEXT,
    image VARCHAR(500),
    author VARCHAR(150),
    category_slug VARCHAR(50) NOT NULL,
    published_at DATE NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_articles_category
        FOREIGN KEY (category_slug) REFERENCES categories(slug),
    INDEX idx_articles_published_at (published_at)
);
