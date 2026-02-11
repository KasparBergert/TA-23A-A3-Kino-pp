-- CreateTable
CREATE TABLE `seatPrices` (
    `type` ENUM('Standard', 'Premium', 'Double') NOT NULL,
    `price` INTEGER NOT NULL DEFAULT 10,

    PRIMARY KEY (`type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
