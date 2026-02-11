-- Migration for PostgreSQL Production Database
-- Add trackingUrl field to Order table

-- Add trackingUrl column
ALTER TABLE "Order" ADD COLUMN "trackingUrl" TEXT;
