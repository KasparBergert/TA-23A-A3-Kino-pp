/*
  Warnings:

  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `is_available` on table `seats` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `role_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_ibfk_1`;

-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_ibfk_2`;

-- AlterTable
ALTER TABLE `seats` MODIFY `is_available` TINYINT NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role_id` TINYINT UNSIGNED NOT NULL;

-- DropTable
DROP TABLE `user_roles`;

-- CreateIndex
CREATE INDEX `FK_users_roles` ON `users`(`role_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `FK_users_roles` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
