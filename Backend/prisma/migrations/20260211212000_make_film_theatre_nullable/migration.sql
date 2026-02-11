-- Allow films without an assigned theatre
ALTER TABLE `film`
  DROP FOREIGN KEY `film_theatreId_fkey`,
  MODIFY `theatreId` INTEGER NULL;

-- Recreate FK with SET NULL to keep films when a theatre is deleted
ALTER TABLE `film`
  ADD CONSTRAINT `film_theatreId_fkey`
  FOREIGN KEY (`theatreId`) REFERENCES `theatre`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Indexes retained; MySQL allows multiple NULLs in unique constraints, so no changes required.
