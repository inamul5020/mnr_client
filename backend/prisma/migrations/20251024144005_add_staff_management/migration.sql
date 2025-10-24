/*
  Warnings:

  - You are about to drop the column `creditLimit` on the `client_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `paymentTerms` on the `client_intakes` table. All the data in the column will be lost.
  - You are about to drop the column `preferredCurrency` on the `client_intakes` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StaffRoleType" AS ENUM ('STAFF', 'SUPERVISOR', 'MANAGER', 'PARTNER', 'HR', 'OFFICE_ADMIN');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('ACTIVE', 'RESIGNED', 'STUDY_LEAVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "client_intakes" DROP COLUMN "creditLimit",
DROP COLUMN "paymentTerms",
DROP COLUMN "preferredCurrency",
ADD COLUMN     "managedBy" TEXT,
ADD COLUMN     "managedByContactName" TEXT,
ALTER COLUMN "phoneMobile" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "natureOfBusiness" DROP NOT NULL;

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "StaffRoleType" NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "employeeId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "photoUrl" TEXT,
    "hireDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" "StaffStatus" NOT NULL DEFAULT 'ACTIVE',
    "resignDate" TIMESTAMP(3),
    "resignReason" TEXT,
    "departmentId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_roles" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "staffId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "staff_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_type_key" ON "roles"("type");

-- CreateIndex
CREATE UNIQUE INDEX "staff_employeeId_key" ON "staff"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_key" ON "staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_userId_key" ON "staff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_roles_staffId_roleId_key" ON "staff_roles"("staffId", "roleId");

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_roles" ADD CONSTRAINT "staff_roles_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_roles" ADD CONSTRAINT "staff_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
