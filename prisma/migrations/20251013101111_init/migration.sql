-- CreateTable
CREATE TABLE "Weapon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fireRate" INTEGER NOT NULL,
    "magazine" INTEGER NOT NULL,
    "reloadTime" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Damage" (
    "id" SERIAL NOT NULL,
    "weaponId" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "damage" INTEGER NOT NULL,

    CONSTRAINT "Damage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Weapon_name_key" ON "Weapon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Damage_weaponId_distance_key" ON "Damage"("weaponId", "distance");

-- AddForeignKey
ALTER TABLE "Damage" ADD CONSTRAINT "Damage_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
