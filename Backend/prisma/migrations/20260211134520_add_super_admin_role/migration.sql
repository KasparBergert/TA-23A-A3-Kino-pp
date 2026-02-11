-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user';
