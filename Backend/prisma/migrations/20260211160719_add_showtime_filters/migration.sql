-- Recreate missing migration: add showtime filters/metadata
ALTER TABLE `showtime`
  ADD COLUMN `format` ENUM('two_d', 'three_d', 'imax') NOT NULL DEFAULT 'two_d',
  ADD COLUMN `language` VARCHAR(191) NOT NULL DEFAULT 'en',
  ADD COLUMN `rating` VARCHAR(191) NOT NULL DEFAULT 'PG';
