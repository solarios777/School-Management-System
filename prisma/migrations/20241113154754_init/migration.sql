/*
  Warnings:

  - You are about to drop the column `lessonId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `gradeId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `gradeId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Result` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SubjectToTeacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT');

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_classId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_examId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_parentId_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_B_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "lessonId";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "gradeId";

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'PARENT';

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "classId",
DROP COLUMN "gradeId",
DROP COLUMN "parentId",
ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT';

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'TEACHER',
ALTER COLUMN "birthday" DROP NOT NULL;

-- DropTable
DROP TABLE "Attendance";

-- DropTable
DROP TABLE "Exam";

-- DropTable
DROP TABLE "Lesson";

-- DropTable
DROP TABLE "Result";

-- DropTable
DROP TABLE "_SubjectToTeacher";

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
