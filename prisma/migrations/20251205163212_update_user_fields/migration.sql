/*
  Warnings:

  - You are about to drop the column `apellido` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "apellido",
DROP COLUMN "nombre",
ADD COLUMN     "avatarColor" TEXT NOT NULL DEFAULT '#F7B267',
ADD COLUMN     "avatarTextColor" TEXT NOT NULL DEFAULT '#6B4F4F',
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;
