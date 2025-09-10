/*
  Warnings:

  - The values [STANDARD,SUV,LUXURY] on the enum `RideType` will be removed. If these variants are still used in the database, this will fail.

*/

-- First, update any existing bookings to use a temporary value that we can convert
-- We'll use a text column approach to handle the conversion safely
ALTER TABLE "public"."bookings" ADD COLUMN "rideType_temp" TEXT;
UPDATE "public"."bookings" SET "rideType_temp" = 'TESLA_MODEL_Y';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."RideType_new" AS ENUM ('TESLA_MODEL_Y');
ALTER TABLE "public"."bookings" ALTER COLUMN "rideType" DROP DEFAULT;
ALTER TABLE "public"."bookings" ALTER COLUMN "rideType" TYPE "public"."RideType_new" USING ("rideType_temp"::"public"."RideType_new");
ALTER TYPE "public"."RideType" RENAME TO "RideType_old";
ALTER TYPE "public"."RideType_new" RENAME TO "RideType";
DROP TYPE "public"."RideType_old";
ALTER TABLE "public"."bookings" ALTER COLUMN "rideType" SET DEFAULT 'TESLA_MODEL_Y';
COMMIT;

-- Clean up the temporary column
ALTER TABLE "public"."bookings" DROP COLUMN "rideType_temp";
