-- First create a default user to link existing accounts
CREATE TABLE `_temp_default_user` AS
SELECT * FROM `User` LIMIT 1;

-- If no user exists, insert a default one
INSERT INTO `User` (id, name, email, password)
SELECT UUID(), 'Default User', 'default@example.com', 'temporary'
    WHERE NOT EXISTS (SELECT * FROM `_temp_default_user`);

-- Get the user ID to use
SET @default_user_id = (SELECT id FROM `User` LIMIT 1);

-- Add the userId column to Account allowing NULL temporarily
ALTER TABLE `Account` ADD COLUMN `userId` VARCHAR(191);

-- Link existing accounts to the default user
UPDATE `Account` SET `userId` = @default_user_id WHERE `userId` IS NULL;

-- Now make userId required
ALTER TABLE `Account` MODIFY COLUMN `userId` VARCHAR(191) NOT NULL;

-- Add the accountId column to Transaction allowing NULL temporarily
ALTER TABLE `Transaction` ADD COLUMN `accountId` VARCHAR(191);

-- Link existing transactions to the first account
SET @default_account_id = (SELECT id FROM `Account` LIMIT 1);
UPDATE `Transaction` SET `accountId` = @default_account_id WHERE `accountId` IS NULL;

-- Now make accountId required
ALTER TABLE `Transaction` MODIFY COLUMN `accountId` VARCHAR(191) NOT NULL;

-- Clean up
DROP TABLE `_temp_default_user`;
