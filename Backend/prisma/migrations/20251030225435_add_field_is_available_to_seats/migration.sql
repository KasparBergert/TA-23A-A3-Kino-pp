/*
  Warnings:

  - You are about to alter the column `theatre_id` on the `halls` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.

*/
-- AlterTable
ALTER TABLE `halls` MODIFY `theatre_id` SMALLINT UNSIGNED NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `seats` ADD COLUMN `is_available` BOOLEAN NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `halls` ADD CONSTRAINT `FK_halls_theatres` FOREIGN KEY (`theatre_id`) REFERENCES `theatres`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
