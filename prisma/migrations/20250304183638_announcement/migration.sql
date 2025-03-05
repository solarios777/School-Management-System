/*
  Warnings:

  - The primary key for the `Announcement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `capacity` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `supervisorId` on the `Class` table. All the data in the column will be lost.
  - The primary key for the `Enrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classId` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `gradeId` on the `Enrollment` table. All the data in the column will be lost.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Grade` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TeacherAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classId` on the `TeacherAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `gradeId` on the `TeacherAssignment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bloodType` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeClassId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bloodType` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstpass` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeClassId` to the `TeacherAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('CLASS', 'BREAK');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'LATE', 'ABSENT');

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_classId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_classId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_classId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_parentId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherAssignment" DROP CONSTRAINT "TeacherAssignment_classId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherAssignment" DROP CONSTRAINT "TeacherAssignment_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherAssignment" DROP CONSTRAINT "TeacherAssignment_subjectId_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "bloodType" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstLogin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "firstpass" TEXT,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "sex" "UserSex" NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_pkey",
ADD COLUMN     "classIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "gradeIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "isForParents" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isForTeachers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isForWholeSchool" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "classId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Announcement_id_seq";

-- AlterTable
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Assignment_id_seq";

-- AlterTable
ALTER TABLE "Class" DROP CONSTRAINT "Class_pkey",
DROP COLUMN "capacity",
DROP COLUMN "supervisorId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Class_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Class_id_seq";

-- AlterTable
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_pkey",
DROP COLUMN "classId",
DROP COLUMN "gradeId",
ADD COLUMN     "gradeClassId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "year" SET DATA TYPE TEXT,
ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Enrollment_id_seq";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "classId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Event_id_seq";

-- AlterTable
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Grade_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Grade_id_seq";

-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "bloodType" TEXT NOT NULL,
ADD COLUMN     "firstLogin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "firstpass" TEXT,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "sex" "UserSex" NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "firstLogin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "firstpass" TEXT NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Subject_id_seq";

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "firstLogin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "firstpass" TEXT;

-- AlterTable
ALTER TABLE "TeacherAssignment" DROP CONSTRAINT "TeacherAssignment_pkey",
DROP COLUMN "classId",
DROP COLUMN "gradeId",
ADD COLUMN     "gradeClassId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "subjectId" SET DATA TYPE TEXT,
ALTER COLUMN "year" SET DATA TYPE TEXT,
ADD CONSTRAINT "TeacherAssignment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TeacherAssignment_id_seq";

-- CreateTable
CREATE TABLE "Counter" (
    "id" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentParent" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "StudentParent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeClass" (
    "id" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "GradeClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Superviser" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "gradeClassId" TEXT NOT NULL,
    "year" TEXT NOT NULL,

    CONSTRAINT "Superviser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "AttendanceStatus",
    "day" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectClassGrade" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "gradeClassId" TEXT NOT NULL,

    CONSTRAINT "SubjectClassGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeriodTimetable" (
    "id" TEXT NOT NULL,
    "rollNo" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "type" "PeriodType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeriodTimetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectQuota" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "gradeClassId" TEXT NOT NULL,
    "weeklyPeriods" INTEGER NOT NULL,

    CONSTRAINT "SubjectQuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "gradeClassId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "day" "Day" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "year" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "marks" DOUBLE PRECISION,
    "examType" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "gradeClassId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByTeacherId" TEXT,
    "createdByAdminId" TEXT,
    "updatedByTeacherId" TEXT,
    "updatedByAdminId" TEXT,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rank" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultRelease" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "isReleased" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultRelease_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Counter_userType_key" ON "Counter"("userType");

-- CreateIndex
CREATE UNIQUE INDEX "StudentParent_studentId_parentId_id_key" ON "StudentParent"("studentId", "parentId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectClassGrade_subjectId_gradeClassId_key" ON "SubjectClassGrade"("subjectId", "gradeClassId");

-- CreateIndex
CREATE UNIQUE INDEX "PeriodTimetable_rollNo_key" ON "PeriodTimetable"("rollNo");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectQuota_subjectId_gradeClassId_key" ON "SubjectQuota"("subjectId", "gradeClassId");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_teacherId_day_startTime_endTime_key" ON "Schedule"("teacherId", "day", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_gradeClassId_subjectId_day_startTime_endTime_key" ON "Schedule"("gradeClassId", "subjectId", "day", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "Result_studentId_subjectId_examType_year_key" ON "Result"("studentId", "subjectId", "examType", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Rank_studentId_semester_year_key" ON "Rank"("studentId", "semester", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phone_key" ON "Admin"("phone");

-- AddForeignKey
ALTER TABLE "StudentParent" ADD CONSTRAINT "StudentParent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentParent" ADD CONSTRAINT "StudentParent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeClass" ADD CONSTRAINT "GradeClass_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeClass" ADD CONSTRAINT "GradeClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_gradeClassId_fkey" FOREIGN KEY ("gradeClassId") REFERENCES "GradeClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Superviser" ADD CONSTRAINT "Superviser_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Superviser" ADD CONSTRAINT "Superviser_gradeClassId_fkey" FOREIGN KEY ("gradeClassId") REFERENCES "GradeClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_gradeClassId_fkey" FOREIGN KEY ("gradeClassId") REFERENCES "GradeClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAssignment" ADD CONSTRAINT "TeacherAssignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectClassGrade" ADD CONSTRAINT "SubjectClassGrade_gradeClassId_fkey" FOREIGN KEY ("gradeClassId") REFERENCES "GradeClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectClassGrade" ADD CONSTRAINT "SubjectClassGrade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectQuota" ADD CONSTRAINT "SubjectQuota_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectQuota" ADD CONSTRAINT "SubjectQuota_gradeClassId_fkey" FOREIGN KEY ("gradeClassId") REFERENCES "GradeClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_gradeClassId_fkey" FOREIGN KEY ("gradeClassId") REFERENCES "GradeClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_createdByTeacherId_fkey" FOREIGN KEY ("createdByTeacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_updatedByTeacherId_fkey" FOREIGN KEY ("updatedByTeacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_updatedByAdminId_fkey" FOREIGN KEY ("updatedByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rank" ADD CONSTRAINT "Rank_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
