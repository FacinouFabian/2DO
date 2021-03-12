/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[uuid]` on the table `User`. If there are existing duplicate values, the migration will fail.
  - Added the required column `uuid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User.uuid_unique" ON "User"("uuid");
