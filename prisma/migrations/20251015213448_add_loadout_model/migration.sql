CREATE TABLE "Loadout" (
    "id" SERIAL NOT NULL,
    "weaponId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "bulletVelocity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loadout_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Loadout" ("weaponId", "name", "bulletVelocity", "updatedAt")
SELECT "id", 'Default', "bulletVelocity", NOW()
FROM "Weapon";

ALTER TABLE "Weapon" DROP COLUMN "bulletVelocity";

CREATE UNIQUE INDEX "Loadout_weaponId_name_key" ON "Loadout"("weaponId", "name");

ALTER TABLE "Loadout" ADD CONSTRAINT "Loadout_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
