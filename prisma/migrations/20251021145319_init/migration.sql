-- CreateTable
CREATE TABLE `film_genres` (
    `film_id` INTEGER NOT NULL,
    `genre_id` SMALLINT UNSIGNED NOT NULL,

    INDEX `film_id`(`film_id`),
    INDEX `genre_id`(`genre_id`),
    PRIMARY KEY (`film_id`, `genre_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `films` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `release_date` DATE NULL,
    `duration_min` SMALLINT UNSIGNED NULL,
    `poster_url` VARCHAR(500) NULL,

    INDEX `release_date`(`release_date`),
    INDEX `title`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genres` (
    `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(60) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `halls` (
    `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `capacity` SMALLINT UNSIGNED NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `status` ENUM('pending', 'paid', 'expired') NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expires_at` TIMESTAMP(0) NULL,

    INDEX `user_id`(`user_id`, `status`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(32) NOT NULL,

    UNIQUE INDEX `code`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hall_id` SMALLINT UNSIGNED NOT NULL,
    `row_label` VARCHAR(5) NOT NULL,
    `seat_number` SMALLINT UNSIGNED NOT NULL,

    INDEX `hall_id_2`(`hall_id`),
    UNIQUE INDEX `hall_id`(`hall_id`, `row_label`, `seat_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `showtimes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `film_id` INTEGER NOT NULL,
    `hall_id` SMALLINT UNSIGNED NOT NULL,
    `starts_at` DATETIME(0) NOT NULL,
    `ends_at` DATETIME(0) NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `is_canceled` BOOLEAN NOT NULL DEFAULT false,

    INDEX `film_id`(`film_id`, `starts_at`),
    INDEX `starts_at`(`starts_at`),
    UNIQUE INDEX `hall_id`(`hall_id`, `starts_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `theatre_halls` (
    `theatre_id` SMALLINT UNSIGNED NOT NULL,
    `hall_id` SMALLINT UNSIGNED NOT NULL,

    INDEX `hall_id`(`hall_id`),
    PRIMARY KEY (`theatre_id`, `hall_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `theatres` (
    `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    INDEX `name_2`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NULL,
    `showtime_id` INTEGER NOT NULL,
    `seat_id` INTEGER NOT NULL,
    `status` ENUM('reserved', 'paid', 'expired') NOT NULL DEFAULT 'reserved',
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `reserved_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `paid_at` TIMESTAMP(0) NULL,
    `ticket_code` VARCHAR(64) NULL,

    UNIQUE INDEX `ticket_code`(`ticket_code`),
    INDEX `order_id`(`order_id`),
    INDEX `seat_id`(`seat_id`),
    INDEX `showtime_id_2`(`showtime_id`, `status`),
    UNIQUE INDEX `showtime_id`(`showtime_id`, `seat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `user_id` INTEGER NOT NULL,
    `role_id` TINYINT UNSIGNED NOT NULL,

    INDEX `role_id`(`role_id`),
    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(128) NOT NULL,
    `hashed_password` VARCHAR(512) NOT NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `film_genres` ADD CONSTRAINT `film_genres_ibfk_1` FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `film_genres` ADD CONSTRAINT `film_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `seats` ADD CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`hall_id`) REFERENCES `halls`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `showtimes` ADD CONSTRAINT `showtimes_ibfk_1` FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `showtimes` ADD CONSTRAINT `showtimes_ibfk_2` FOREIGN KEY (`hall_id`) REFERENCES `halls`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `theatre_halls` ADD CONSTRAINT `theatre_halls_ibfk_1` FOREIGN KEY (`theatre_id`) REFERENCES `theatres`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `theatre_halls` ADD CONSTRAINT `theatre_halls_ibfk_2` FOREIGN KEY (`hall_id`) REFERENCES `halls`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
