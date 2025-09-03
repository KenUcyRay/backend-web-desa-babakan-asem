-- AlterTable
ALTER TABLE `users` ADD COLUMN `emergency_change` INTEGER NOT NULL DEFAULT 5;

-- CreateTable
CREATE TABLE `emergencies` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `message` TEXT NOT NULL,
    `latitude` VARCHAR(50) NOT NULL,
    `longitude` VARCHAR(50) NOT NULL,
    `is_handled` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `emergencies` ADD CONSTRAINT `emergencies_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
