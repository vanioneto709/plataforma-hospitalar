/*
  Warnings:

  - Added the required column `senha_hash` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Paciente` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Paciente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "data_nascimento" DATETIME,
    "genero" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Paciente" ("createdAt", "data_nascimento", "email", "genero", "id", "nome", "telefone") SELECT "createdAt", "data_nascimento", "email", "genero", "id", "nome", "telefone" FROM "Paciente";
DROP TABLE "Paciente";
ALTER TABLE "new_Paciente" RENAME TO "Paciente";
CREATE UNIQUE INDEX "Paciente_email_key" ON "Paciente"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
