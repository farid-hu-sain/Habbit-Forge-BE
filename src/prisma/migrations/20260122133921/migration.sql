/*
  Warnings:

  - Changed the type of `name` on the `categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `frequency` to the `habits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `habits` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "CategoryName" AS ENUM ('HEALTHY', 'FINANCE', 'WORK', 'LEARNING', 'SOCIAL');

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "name",
ADD COLUMN     "name" "CategoryName" NOT NULL;

-- AlterTable
ALTER TABLE "habits" ADD COLUMN     "frequency" "Frequency" NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
