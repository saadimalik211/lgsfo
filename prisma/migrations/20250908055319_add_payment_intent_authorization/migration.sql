/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."PaymentStatus" ADD VALUE 'AUTHORIZED';
ALTER TYPE "public"."PaymentStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "public"."accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "stripePaymentIntentId" TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "emailVerified",
DROP COLUMN "image";

-- DropTable
DROP TABLE "public"."accounts";

-- DropTable
DROP TABLE "public"."sessions";

-- DropTable
DROP TABLE "public"."verification_tokens";
