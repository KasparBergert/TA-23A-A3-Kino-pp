/*
  Warnings:

  - You are about to alter the column `film_id` on the `actors` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `Int`.
  - You are about to alter the column `id` on the `actors` table. The data in that column could be lost. The data in that column will be cast from `UnsignedBigInt` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `actors` MODIFY `film_id` INTEGER NOT NULL DEFAULT 0,
    MODIFY `id` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE INDEX `FK1_actors_films` ON `actors`(`film_id`);

-- AddForeignKey
ALTER TABLE `actors` ADD CONSTRAINT `FK1_actors_films` FOREIGN KEY (`film_id`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
