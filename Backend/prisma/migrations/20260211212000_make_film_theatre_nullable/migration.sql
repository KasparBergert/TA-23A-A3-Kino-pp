-- Allow films without an assigned theatre
ALTER TABLE `film`
  DROP FOREIGN KEY `film_theatreId_fkey`,
  MODIFY `theatreId` INTEGER NULL;

-- Recreate FK with SET NULL to keep films when a theatre is deleted
ALTER TABLE `film`
  ADD CONSTRAINT `film_theatreId_fkey`
  FOREIGN KEY (`theatreId`) REFERENCES `theatre`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Unique/index remain valid with nullable column; MySQL permits multiple NULLs
DROP INDEX IF EXISTS `film_title_releaseDate_theatreId_key` ON `film`;
DROP INDEX IF EXISTS `film_theatreId_idx` ON `film`;
CREATE UNIQUE INDEX `film_title_releaseDate_theatreId_key` ON `film`(`title`, `releaseDate`, `theatreId`);
CREATE INDEX `film_theatreId_idx` ON `film`(`theatreId`);
