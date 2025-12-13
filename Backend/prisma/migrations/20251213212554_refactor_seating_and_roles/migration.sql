/*
  Warnings:

  - You are about to drop the column `is_available` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `row_label` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `seat_number` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `showtimes` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `halls` will be added. If there are existing duplicate values, this will fail.
  - Made the column `poster_url` on table `films` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `seats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `seats` DROP FOREIGN KEY `seats_ibfk_1`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `FK_users_roles`;

-- DropIndex
DROP INDEX `hall_id` ON `seats`;

-- DropIndex
DROP INDEX `FK_users_roles` ON `users`;

-- AlterTable
ALTER TABLE `films` MODIFY `poster_url` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `seats` DROP COLUMN `is_available`,
    DROP COLUMN `row_label`,
    DROP COLUMN `seat_number`,
    ADD COLUMN `price` INTEGER NOT NULL DEFAULT 10,
    ADD COLUMN `status` ENUM('available', 'taken') NOT NULL DEFAULT 'available',
    ADD COLUMN `type` ENUM('Standard', 'Premium', 'Double') NOT NULL;

-- AlterTable
ALTER TABLE `showtimes` DROP COLUMN `price`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `role_id`,
    ADD COLUMN `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user';

-- DropTable
DROP TABLE `roles`;

-- CreateTable
CREATE TABLE `seatlocation` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `seat_id` INTEGER NOT NULL,
    `column` INTEGER NOT NULL,
    `row_label` VARCHAR(3) NOT NULL DEFAULT '',

    INDEX `FK_seatLocation_seats`(`seat_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `name` ON `halls`(`name`);

-- AddForeignKey
ALTER TABLE `seats` ADD CONSTRAINT `FK_seats_halls` FOREIGN KEY (`hall_id`) REFERENCES `halls`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seatlocation` ADD CONSTRAINT `FK_seatLocation_seats` FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `FK_seats_halls` ON `seats`(`hall_id`);
DROP INDEX `hall_id_2` ON `seats`;
