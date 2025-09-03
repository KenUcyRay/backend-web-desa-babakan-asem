/*
  Warnings:

  - Added the required column `phone_number` to the `emergencies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `emergencies` ADD COLUMN `phone_number` VARCHAR(20) NOT NULL;
