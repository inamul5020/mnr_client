-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('INDIVIDUAL', 'PARTNERSHIP', 'COMPANY', 'NGO', 'OTHER');

-- CreateEnum
CREATE TYPE "ClientPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VIP');

-- CreateEnum
CREATE TYPE "RamisStatus" AS ENUM ('AVAILABLE', 'NOT_AVAILABLE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'STAFF');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT');

-- CreateTable
CREATE TABLE "client_intakes" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "tradeName" TEXT,
    "type" "ClientType" NOT NULL,
    "ownerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "phoneMobile" TEXT NOT NULL,
    "phoneLand" TEXT,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "natureOfBusiness" TEXT NOT NULL,
    "industry" TEXT,
    "clientPriority" "ClientPriority" NOT NULL DEFAULT 'MEDIUM',
    "servicesSelected" TEXT[],
    "directTaxSubcategories" TEXT[],
    "indirectTaxSubcategories" TEXT[],
    "serviceFrequencies" JSONB,
    "taxReturnYears" JSONB,
    "tin" TEXT,
    "otherRegistrations" TEXT,
    "companySecretary" TEXT,
    "registrationNumber" TEXT,
    "incorporationDate" TIMESTAMP(3),
    "annualRevenue" DECIMAL(15,2),
    "employeeCount" INTEGER,
    "ramisStatus" "RamisStatus" NOT NULL,
    "ramisEmail" TEXT,
    "docsBusinessReg" BOOLEAN NOT NULL DEFAULT false,
    "docsDeed" BOOLEAN NOT NULL DEFAULT false,
    "docsVehicleReg" BOOLEAN NOT NULL DEFAULT false,
    "docsOther1" TEXT,
    "docsOther2" TEXT,
    "complianceNotes" TEXT,
    "creditLimit" DECIMAL(15,2),
    "paymentTerms" TEXT,
    "preferredCurrency" TEXT DEFAULT 'USD',
    "notes" TEXT,
    "consent" BOOLEAN NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "client_intakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "related_parties" (
    "id" TEXT NOT NULL,
    "clientIntakeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "tin" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "related_parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "userId" TEXT NOT NULL,
    "clientIntakeId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "related_parties" ADD CONSTRAINT "related_parties_clientIntakeId_fkey" FOREIGN KEY ("clientIntakeId") REFERENCES "client_intakes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_clientIntakeId_fkey" FOREIGN KEY ("clientIntakeId") REFERENCES "client_intakes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
