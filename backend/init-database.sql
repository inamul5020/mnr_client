-- Initialize MNR Client Intake Database
-- This script creates the necessary tables for the application

-- Create the main client_intakes table
CREATE TABLE IF NOT EXISTS "ClientIntake" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "tradeName" TEXT,
    "type" TEXT NOT NULL,
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
    "clientPriority" TEXT DEFAULT 'MEDIUM',
    "servicesSelected" TEXT[],
    "serviceFrequency" TEXT,
    "tin" TEXT,
    "taxTypesSelected" TEXT[],
    "otherRegistrations" TEXT,
    "companySecretary" TEXT,
    "registrationNumber" TEXT,
    "incorporationDate" TIMESTAMP(3),
    "annualRevenue" DOUBLE PRECISION,
    "employeeCount" INTEGER,
    "ramisStatus" TEXT NOT NULL,
    "ramisEmail" TEXT,
    "docsBusinessReg" BOOLEAN DEFAULT false,
    "docsDeed" BOOLEAN DEFAULT false,
    "docsVehicleReg" BOOLEAN DEFAULT false,
    "docsOther1" TEXT,
    "docsOther2" TEXT,
    "complianceNotes" TEXT,
    "creditLimit" DOUBLE PRECISION,
    "paymentTerms" TEXT,
    "preferredCurrency" TEXT DEFAULT 'USD',
    "notes" TEXT,
    "consent" BOOLEAN NOT NULL,
    "submittedBy" TEXT,
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClientIntake_pkey" PRIMARY KEY ("id")
);

-- Create the related_parties table
CREATE TABLE IF NOT EXISTS "RelatedParty" (
    "id" TEXT NOT NULL,
    "clientIntakeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "tin" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RelatedParty_pkey" PRIMARY KEY ("id")
);

-- Create the users table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create the audit_logs table
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "oldValues" TEXT,
    "newValues" TEXT,
    "clientIntakeId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "RelatedParty" ADD CONSTRAINT "RelatedParty_clientIntakeId_fkey" FOREIGN KEY ("clientIntakeId") REFERENCES "ClientIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default users
INSERT INTO "User" ("id", "username", "password", "fullName", "role", "isActive") VALUES
('admin', 'admin', 'admin123', 'System Administrator', 'ADMIN', true),
('manager', 'manager', 'manager123', 'John Manager', 'MANAGER', true),
('staff1', 'staff1', 'staff123', 'Sarah Staff', 'STAFF', true),
('staff2', 'staff2', 'staff123', 'Mike Staff', 'STAFF', true)
ON CONFLICT ("id") DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "ClientIntake_type_idx" ON "ClientIntake"("type");
CREATE INDEX IF NOT EXISTS "ClientIntake_email_idx" ON "ClientIntake"("email");
CREATE INDEX IF NOT EXISTS "ClientIntake_submittedAt_idx" ON "ClientIntake"("submittedAt");
CREATE INDEX IF NOT EXISTS "RelatedParty_clientIntakeId_idx" ON "RelatedParty"("clientIntakeId");
CREATE INDEX IF NOT EXISTS "AuditLog_entityId_idx" ON "AuditLog"("entityId");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
