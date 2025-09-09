-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('STRIPE', 'CASH', 'VENMO', 'ZELLE', 'OTHER');

-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'STRIPE';
