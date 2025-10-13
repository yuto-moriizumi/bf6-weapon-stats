/*
  Warnings:

  - Added the required column `bulletVelocity` to the `Weapon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Weapon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Weapon" ADD COLUMN     "bulletVelocity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "WeaponCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WeaponCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeaponCategory_name_key" ON "WeaponCategory"("name");

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "WeaponCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
