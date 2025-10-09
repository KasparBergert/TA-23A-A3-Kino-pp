use movies;

-- Global defaults
SET NAMES utf8mb4; 
SET @@note_verbosity = 0; -- display no warnings

-- ========= SECURITY / ACCOUNTS =========

-- Must match the getUser.ts interface
CREATE TABLE if not exists users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  email           VARCHAR(128) NOT NULL UNIQUE,
  hashed_password VARCHAR(512) NOT NULL,  
  updated_at      TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE if not exists roles (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code varchar(32) NOT NULL UNIQUE  -- 'admin','user'
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE if not exists user_roles (
  user_id INT NOT NULL,
  role_id TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) DEFAULT CHARSET=utf8mb4;

-- ========= CATALOG: FILMS / GENRES =========

CREATE TABLE if not exists films (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  release_date DATE,
  duration_min SMALLINT UNSIGNED,
  poster_url   VARCHAR(500),  
  INDEX (title),
  INDEX (release_date)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE if not exists genres (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE if not exists film_genres (
  film_id  INT NOT NULL,
  genre_id SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (film_id, genre_id),
  FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE RESTRICT,
  INDEX(film_id),
  INDEX(genre_id)
) DEFAULT CHARSET=utf8mb4;

-- ========= VENUE: THEATRES / HALLS / SEATS =========

CREATE TABLE IF NOT EXISTS theatres (
  id   SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  
  name VARCHAR(128) NOT NULL UNIQUE
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS halls (
  id       SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(50) NOT NULL UNIQUE,
  capacity SMALLINT UNSIGNED NOT NULL
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS theatre_halls (
  theatre_id SMALLINT UNSIGNED NOT NULL,
  hall_id    SMALLINT UNSIGNED NOT NULL,  
  PRIMARY KEY (theatre_id, hall_id),
  FOREIGN KEY (theatre_id) REFERENCES theatres(id) ON DELETE CASCADE,
  FOREIGN KEY (hall_id) REFERENCES halls(id)
) DEFAULT CHARSET=utf8mb4;


CREATE TABLE if not exists seats (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  hall_id     SMALLINT UNSIGNED NOT NULL,
  row_label   VARCHAR(5) NOT NULL,
  seat_number SMALLINT UNSIGNED NOT NULL,  
  UNIQUE (hall_id, row_label, seat_number),
  FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE,
  INDEX (hall_id)
) DEFAULT CHARSET=utf8mb4;

-- ========= SCHEDULING: SHOWTIMES =========

CREATE TABLE if not exists showtimes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  film_id     INT NOT NULL,
  hall_id     SMALLINT UNSIGNED NOT NULL,
  starts_at   DATETIME NOT NULL,
  ends_at     DATETIME NULL,
  price       DECIMAL(10,2) NOT NULL,
  is_canceled BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE RESTRICT,
  FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE RESTRICT,
  UNIQUE (hall_id, starts_at),
  INDEX (film_id, starts_at),
  INDEX (starts_at)
) DEFAULT CHARSET=utf8mb4;

-- ========= ORDERS / TICKETS =========

CREATE TABLE if not exists orders (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  status         ENUM('pending','paid','expired') NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at     TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (user_id, status, created_at)
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE if not exists tickets (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id       BIGINT NULL,
  showtime_id    INT NOT NULL,
  seat_id        INT NOT NULL,
  status         ENUM('reserved','paid','expired') NOT NULL DEFAULT 'reserved',
  unit_price     DECIMAL(10,2) NOT NULL,
  reserved_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at        TIMESTAMP NULL,
  ticket_code    VARCHAR(64) UNIQUE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE RESTRICT,
  FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE RESTRICT,
  UNIQUE (showtime_id, seat_id),
  INDEX (showtime_id, status),
  INDEX (seat_id),
  INDEX (order_id)
) DEFAULT CHARSET=utf8mb4;

SET @@note_verbosity = 1;