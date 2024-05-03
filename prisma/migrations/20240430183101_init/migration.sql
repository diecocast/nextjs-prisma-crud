/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Note";

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" SERIAL NOT NULL,
    "order" SERIAL NOT NULL,
    "cot" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);
