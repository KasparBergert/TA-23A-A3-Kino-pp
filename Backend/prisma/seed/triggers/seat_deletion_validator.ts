import prisma from '../../../Backend/db'


//deletes filler seat when double seat is deleted
//prevents deleting filler directly
//allows deleting standard and premium seats
export async function seat_deletion_validator() {
  await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS seat_deletion_validator;`)
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER seat_deletion_validator
    BEFORE DELETE ON seats
    FOR EACH ROW
    BEGIN
    	DECLARE filler_id INT DEFAULT NULL;
      -- If a Double seat is deleted, also delete its corresponding Filler seat
      IF OLD.type = 'Double' THEN

        SELECT id INTO filler_id
        FROM seats
        WHERE hall_id = OLD.hall_id
          AND row_label = OLD.row_label
          AND seat_number = OLD.seat_number + 1
          AND type = 'Filler'
        LIMIT 1;

        IF filler_id IS NOT NULL THEN
          DELETE FROM seats WHERE id = filler_id;
        END IF;

      END IF;

      -- Prevent deleting filler directly
      IF OLD.type = 'Filler' THEN
        SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Delete the Double seat instead, not the filler seat.';
      END IF;

      END;
  `)
}
