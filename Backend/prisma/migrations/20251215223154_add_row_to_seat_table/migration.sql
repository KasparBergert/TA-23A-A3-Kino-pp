/*
  Warnings:

  - You are about to drop the `actors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `film_genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `films` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `halls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seatlocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `showtimes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `theatres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tickets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `actors` DROP FOREIGN KEY `FK1_actors_films`;

-- DropForeignKey
ALTER TABLE `film_genres` DROP FOREIGN KEY `film_genres_ibfk_1`;

-- DropForeignKey
ALTER TABLE `film_genres` DROP FOREIGN KEY `film_genres_ibfk_2`;

-- DropForeignKey
ALTER TABLE `halls` DROP FOREIGN KEY `FK_halls_theatres`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_ibfk_1`;

-- DropForeignKey
ALTER TABLE `seatlocation` DROP FOREIGN KEY `FK_seatLocation_seats`;

-- DropForeignKey
ALTER TABLE `seats` DROP FOREIGN KEY `FK_seats_halls`;

-- DropForeignKey
ALTER TABLE `showtimes` DROP FOREIGN KEY `showtimes_ibfk_1`;

-- DropForeignKey
ALTER TABLE `showtimes` DROP FOREIGN KEY `showtimes_ibfk_2`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_ibfk_2`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_ibfk_3`;

-- DropTable
DROP TABLE `actors`;

-- DropTable
DROP TABLE `film_genres`;

-- DropTable
DROP TABLE `films`;

-- DropTable
DROP TABLE `genres`;

-- DropTable
DROP TABLE `halls`;

-- DropTable
DROP TABLE `orders`;

-- DropTable
DROP TABLE `seatlocation`;

-- DropTable
DROP TABLE `seats`;

-- DropTable
DROP TABLE `showtimes`;

-- DropTable
DROP TABLE `theatres`;

-- DropTable
DROP TABLE `tickets`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `film` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `releaseDate` DATETIME(3) NULL,
    `durationMin` INTEGER NULL,
    `posterUrl` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `film_title_releaseDate_key`(`title`, `releaseDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `genre_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filmGenre` (
    `filmId` INTEGER NOT NULL,
    `genreId` INTEGER NOT NULL,

    INDEX `filmGenre_filmId_idx`(`filmId`),
    INDEX `filmGenre_genreId_idx`(`genreId`),
    PRIMARY KEY (`filmId`, `genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `status` ENUM('pending', 'paid', 'expired') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,

    INDEX `order_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `theatre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `theatre_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hall` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `theatreId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,

    UNIQUE INDEX `hall_name_key`(`name`),
    INDEX `hall_theatreId_idx`(`theatreId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hallId` INTEGER NOT NULL,
    `type` ENUM('Standard', 'Premium', 'Double') NOT NULL,
    `row` VARCHAR(191) NOT NULL,

    INDEX `seat_hallId_idx`(`hallId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `showtime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filmId` INTEGER NOT NULL,
    `hallId` INTEGER NOT NULL,
    `startsAt` DATETIME(3) NOT NULL,
    `endsAt` DATETIME(3) NOT NULL,
    `isCanceled` BOOLEAN NOT NULL DEFAULT false,

    INDEX `showtime_filmId_idx`(`filmId`),
    INDEX `showtime_hallId_idx`(`hallId`),
    UNIQUE INDEX `showtime_hallId_startsAt_key`(`hallId`, `startsAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `orderId` BIGINT NULL,
    `showtimeId` INTEGER NOT NULL,
    `seatId` INTEGER NOT NULL,
    `status` ENUM('reserved', 'paid', 'expired') NOT NULL DEFAULT 'reserved',
    `unitPrice` DECIMAL(65, 30) NOT NULL,
    `reservedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paidAt` DATETIME(3) NULL,
    `ticketCode` VARCHAR(191) NULL,

    UNIQUE INDEX `ticket_ticketCode_key`(`ticketCode`),
    INDEX `ticket_orderId_idx`(`orderId`),
    INDEX `ticket_showtimeId_idx`(`showtimeId`),
    INDEX `ticket_seatId_idx`(`seatId`),
    UNIQUE INDEX `ticket_showtimeId_seatId_key`(`showtimeId`, `seatId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `filmId` INTEGER NOT NULL,
    `link` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `actor_name_key`(`name`),
    INDEX `actor_filmId_idx`(`filmId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `showtimeTakenSeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seatId` INTEGER NOT NULL,
    `showtimeId` INTEGER NOT NULL,

    INDEX `showtimeTakenSeat_seatId_idx`(`seatId`),
    INDEX `showtimeTakenSeat_showtimeId_idx`(`showtimeId`),
    UNIQUE INDEX `showtimeTakenSeat_seatId_showtimeId_key`(`seatId`, `showtimeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `filmGenre` ADD CONSTRAINT `filmGenre_filmId_fkey` FOREIGN KEY (`filmId`) REFERENCES `film`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `filmGenre` ADD CONSTRAINT `filmGenre_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `genre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hall` ADD CONSTRAINT `hall_theatreId_fkey` FOREIGN KEY (`theatreId`) REFERENCES `theatre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seat` ADD CONSTRAINT `seat_hallId_fkey` FOREIGN KEY (`hallId`) REFERENCES `hall`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `showtime` ADD CONSTRAINT `showtime_filmId_fkey` FOREIGN KEY (`filmId`) REFERENCES `film`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `showtime` ADD CONSTRAINT `showtime_hallId_fkey` FOREIGN KEY (`hallId`) REFERENCES `hall`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_showtimeId_fkey` FOREIGN KEY (`showtimeId`) REFERENCES `showtime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_seatId_fkey` FOREIGN KEY (`seatId`) REFERENCES `seat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `actor` ADD CONSTRAINT `actor_filmId_fkey` FOREIGN KEY (`filmId`) REFERENCES `film`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `showtimeTakenSeat` ADD CONSTRAINT `showtimeTakenSeat_seatId_fkey` FOREIGN KEY (`seatId`) REFERENCES `seat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `showtimeTakenSeat` ADD CONSTRAINT `showtimeTakenSeat_showtimeId_fkey` FOREIGN KEY (`showtimeId`) REFERENCES `showtime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
