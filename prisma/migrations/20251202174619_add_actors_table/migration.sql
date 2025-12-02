-- CreateTable
CREATE TABLE `actors` (
    `name` TEXT NOT NULL,
    `film_id` INTEGER NOT NULL DEFAULT 0,
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `link` TEXT NULL,
    `image_url` TEXT NOT NULL,

    INDEX `FK1_actors_films`(`film_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `actors` ADD CONSTRAINT `FK1_actors_films` FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
