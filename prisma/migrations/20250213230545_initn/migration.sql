/*
  Warnings:

  - A unique constraint covering the columns `[password]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Account` ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Account_password_key` ON `Account`(`password`);
