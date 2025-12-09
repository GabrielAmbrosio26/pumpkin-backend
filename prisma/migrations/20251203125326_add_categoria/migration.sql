/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoria` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoria" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_nombre_key" ON "Product"("nombre");
