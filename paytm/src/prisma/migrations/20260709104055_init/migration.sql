-- CreateEnum
CREATE TYPE "Operator" AS ENUM ('JIO', 'AIRTEL', 'VI', 'BSNL');

-- CreateEnum
CREATE TYPE "RechargeStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recharge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "operator" "Operator" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "RechargeStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recharge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phoneNumber_idx" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Recharge_transactionId_key" ON "Recharge"("transactionId");

-- CreateIndex
CREATE INDEX "Recharge_userId_idx" ON "Recharge"("userId");

-- CreateIndex
CREATE INDEX "Recharge_mobileNumber_idx" ON "Recharge"("mobileNumber");

-- CreateIndex
CREATE INDEX "Recharge_status_idx" ON "Recharge"("status");

-- AddForeignKey
ALTER TABLE "Recharge" ADD CONSTRAINT "Recharge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
