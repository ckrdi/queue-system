-- CreateEnum
CREATE TYPE "QueueType" AS ENUM ('Reservation', 'WalkIn');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('Waiting', 'Called', 'Done');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "serveNumber" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL,
    "queueNo" TEXT NOT NULL,
    "type" "QueueType" NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'Waiting',
    "calledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "staffId" TEXT,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Queue_queueNo_key" ON "Queue"("queueNo");

-- CreateIndex
CREATE INDEX "Queue_status_idx" ON "Queue"("status");

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
