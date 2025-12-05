import prisma from "../../../Backend/db"

export async function prevent_double_seat_when_seat_next_is_taken() {
  await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS prevent_double_seat_when_seat_next_is_taken;`)
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER prevent_double_seat_when_seat_next_is_taken
    BEFORE UPDATE ON seats
    FOR EACH ROW
    BEGIN
        DECLARE right_side_seat

        SELECT id INTO right_side_seat
        FROM seats
        WHERE NEW.seat_number = (NEW.seat_number + 1)
        AND NEW.seat_row = seat_row
        AND NEW.hall_id = hall_id
        LIMIT 1;

        -- If seat next to the double seat is already taken, send error
        IF right_side_seat NOT NULL THEN
          SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Failed to create double seat, because seat next to it is taken'
        END IF;
    END;
  `)
}
