-- AlterTable
ALTER TABLE "Order" ADD COLUMN "shippingAddress" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingCost" DECIMAL;
ALTER TABLE "Order" ADD COLUMN "shippingMethod" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingZip" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "dimensions" TEXT;
ALTER TABLE "Product" ADD COLUMN "weight" DECIMAL;

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "trackingNumber" TEXT,
    "carrier" TEXT NOT NULL DEFAULT 'Correo Argentino',
    "service" TEXT NOT NULL,
    "cost" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "labelUrl" TEXT,
    "estimatedDelivery" DATETIME,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_orderId_key" ON "Shipment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_trackingNumber_key" ON "Shipment"("trackingNumber");
