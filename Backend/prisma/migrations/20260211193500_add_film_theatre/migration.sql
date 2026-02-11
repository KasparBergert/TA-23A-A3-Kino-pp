-- Add theatre relation to films
ALTER TABLE `film` ADD COLUMN `theatreId` INTEGER NOT NULL;

-- Recreate unique/indexes with theatre scope
DROP INDEX `film_title_releaseDate_key` ON `film`;
CREATE INDEX `film_theatreId_idx` ON `film`(`theatreId`);
CREATE UNIQUE INDEX `film_title_releaseDate_theatreId_key` ON `film`(`title`, `releaseDate`, `theatreId`);

-- Foreign key constraint
ALTER TABLE `film`
  ADD CONSTRAINT `film_theatreId_fkey`
  FOREIGN KEY (`theatreId`) REFERENCES `theatre`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
