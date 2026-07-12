-- AlterTable
ALTER TABLE "availability_exceptions" ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;
