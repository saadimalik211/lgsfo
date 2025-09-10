/*
  Warnings:

  - The values [STANDARD,SUV,LUXURY] on the enum `RideType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."RideType_new" AS ENUM ('TESLA_MODEL_Y');
ALTER TABLE "public"."bookings" ALTER COLUMN "rideType" DROP DEFAULT;
ALTER TABLE "public"."bookings" ALTER COLUMN "rideType" TYPE "public"."RideType_new" USING ("rideType"::text::"public"."RideType_new");
ALTER TYPE "public"."RideType" RENAME TO "RideType_old";
ALTER TYPE "public"."RideType_new" RENAME TO "RideType";
DROP TYPE "public"."RideType_old";
ALTER TABLE "public"."bookings" ALTER COLUMN "rideType" SET DEFAULT 'TESLA_MODEL_Y';
COMMIT;

-- AlterTable
ALTER TABLE "public"."bookings" ALTER COLUMN "rideType" SET DEFAULT 'TESLA_MODEL_Y';
