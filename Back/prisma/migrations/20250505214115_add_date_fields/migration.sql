-- AlterTable
ALTER TABLE "Animal" ADD COLUMN "elveszesIdeje" TEXT;
ALTER TABLE "Animal" ADD COLUMN "megtalalasDatum" TEXT;

-- Update existing records: set elveszesIdeje to datum for all records
UPDATE "Animal" SET "elveszesIdeje" = "datum" WHERE "elveszesIdeje" IS NULL;

-- Update existing records: set megtalalasDatum to datum for all records
UPDATE "Animal" SET "megtalalasDatum" = "datum" WHERE "megtalalasDatum" IS NULL;
