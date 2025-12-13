CREATE TRIGGER prevent_admin_buy_tickets
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  DECLARE user_role VARCHAR(10);

  SELECT role
  INTO user_role
  FROM users
  WHERE id = NEW.user_id;

  IF user_role = 'admin' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Admin cannot make purchases';
  END IF;
END