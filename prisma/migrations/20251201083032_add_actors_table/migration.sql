-- CreateTable
CREATE TABLE `actors` (
    `name` TEXT NOT NULL,
    `film_id` BIGINT UNSIGNED NOT NULL,
    `id` BIGINT UNSIGNED NOT NULL,
    `link` TEXT NULL,
    `image_url` TEXT NOT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
