-- CreateTable
CREATE TABLE "Offer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "priceCents" INTEGER,
    "badge" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "pickupDate" TEXT NOT NULL,
    "pickupTime" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "totalCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "menuItemId" INTEGER,
    "name" TEXT NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "priceCents" INTEGER NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "promoLabel" TEXT NOT NULL DEFAULT '',
    "meatOrigin" TEXT NOT NULL DEFAULT '',
    "allergens" TEXT NOT NULL DEFAULT '',
    "available" BOOLEAN NOT NULL DEFAULT true,
    "sort" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MenuItem" ("available", "categoryId", "description", "featured", "id", "image", "name", "priceCents", "promoLabel", "sort") SELECT "available", "categoryId", "description", "featured", "id", "image", "name", "priceCents", "promoLabel", "sort" FROM "MenuItem";
DROP TABLE "MenuItem";
ALTER TABLE "new_MenuItem" RENAME TO "MenuItem";
CREATE INDEX "MenuItem_categoryId_idx" ON "MenuItem"("categoryId");
CREATE TABLE "new_Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT 'La Grillade de Malpa',
    "phone" TEXT NOT NULL DEFAULT '09 84 37 95 25',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "street" TEXT NOT NULL DEFAULT '1 Avenue de Valdonne',
    "postalCode" TEXT NOT NULL DEFAULT '13013',
    "city" TEXT NOT NULL DEFAULT 'Marseille',
    "latitude" REAL NOT NULL DEFAULT 43.3318,
    "longitude" REAL NOT NULL DEFAULT 5.4135,
    "uberRating" REAL NOT NULL DEFAULT 4.4,
    "uberReviewCount" TEXT NOT NULL DEFAULT '300+',
    "deliveryZones" TEXT NOT NULL DEFAULT 'Marseille 13e, Marseille 14e, Marseille 12e',
    "slotCapacity" INTEGER NOT NULL DEFAULT 20,
    "maxGuestsOnline" INTEGER NOT NULL DEFAULT 20,
    "announcement" TEXT NOT NULL DEFAULT '',
    "parkingInfo" TEXT NOT NULL DEFAULT 'Stationnement possible dans les rues alentour. Le métro Malpassé (ligne M1) est à proximité.',
    "transportInfo" TEXT NOT NULL DEFAULT '',
    "meatOriginNote" TEXT NOT NULL DEFAULT '',
    "clickAndCollectEnabled" BOOLEAN NOT NULL DEFAULT true,
    "googleMapsUrl" TEXT NOT NULL DEFAULT '',
    "googleReviewUrl" TEXT NOT NULL DEFAULT '',
    "tiktok" TEXT NOT NULL DEFAULT 'https://www.tiktok.com/@grillade.de.malpa',
    "instagram" TEXT NOT NULL DEFAULT '',
    "facebook" TEXT NOT NULL DEFAULT '',
    "snapchat" TEXT NOT NULL DEFAULT '',
    "heroImage" TEXT NOT NULL DEFAULT '',
    "storyImage" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Setting" ("announcement", "city", "deliveryZones", "email", "facebook", "googleMapsUrl", "googleReviewUrl", "heroImage", "id", "instagram", "latitude", "longitude", "maxGuestsOnline", "name", "parkingInfo", "phone", "postalCode", "slotCapacity", "snapchat", "storyImage", "street", "tiktok", "uberRating", "uberReviewCount", "updatedAt", "whatsapp") SELECT "announcement", "city", "deliveryZones", "email", "facebook", "googleMapsUrl", "googleReviewUrl", "heroImage", "id", "instagram", "latitude", "longitude", "maxGuestsOnline", "name", "parkingInfo", "phone", "postalCode", "slotCapacity", "snapchat", "storyImage", "street", "tiktok", "uberRating", "uberReviewCount", "updatedAt", "whatsapp" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Order_pickupDate_status_idx" ON "Order"("pickupDate", "status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
