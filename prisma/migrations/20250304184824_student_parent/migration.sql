/*
  Warnings:

  - A unique constraint covering the columns `[studentId,parentId]` on the table `StudentParent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StudentParent_studentId_parentId_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "StudentParent_studentId_parentId_key" ON "StudentParent"("studentId", "parentId");
