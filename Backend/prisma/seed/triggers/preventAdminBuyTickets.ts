import prisma from "../../../db"


export async function preventAdminBuyTickets() {
  await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS prevent_admin_buy_tickets;`)
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER prevent_admin_buy_tickets
    BEFORE UPDATE ON orders
    FOR EACH ROW
    BEGIN
      DECLARE user_role VARCHAR(10);
      SELECT r.code INTO user_role
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.id = NEW.user_id
      LIMIT 1;

      IF user_role = 'admin' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Admin cannot make purchases';
      END IF;
    END;
  `)
}
