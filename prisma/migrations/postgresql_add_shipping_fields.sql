-- Migration for PostgreSQL Production Database
-- Add shipping type and free shipping fields to Order table

-- Add shippingType column
ALTER TABLE "Order" ADD COLUMN "shippingType" TEXT DEFAULT 'STANDARD';

-- Add isFreeShipping column  
ALTER TABLE "Order" ADD COLUMN "isFreeShipping" BOOLEAN NOT NULL DEFAULT false;
