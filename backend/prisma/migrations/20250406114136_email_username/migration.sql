/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- Drop the email index first
DROP INDEX "User_email_key";

-- Drop the email column
ALTER TABLE "User" DROP COLUMN "email";

-- Add username as nullable first
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Update existing rows with a default value (using id as temporary username)
UPDATE "User" SET "username" = id;

-- Make the column required
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

-- Add unique constraint
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
