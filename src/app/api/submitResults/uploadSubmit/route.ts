import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.role;
    const userId = user.id;

    const body = await req.json();
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const processedResults = await Promise.all(
      body.map(async (entry) => {
        const { studentusername, studentId: studentName, subjectId, examType, year, semester, scores, gradeId, classId } = entry;
        
        // Find the Student ID using username and name
        const student = await prisma.student.findFirst({
          where: { username: studentusername, name: studentName },
        });

        if (!student) {
          return NextResponse.json({ error: "Student not found" }, { status: 400 });
        }

        // Find the GradeClass ID
        const gradeClass = await prisma.gradeClass.findFirst({
          where: { gradeId, classId },
        });

        if (!gradeClass) {
          return NextResponse.json({ error: "Invalid grade or class" }, { status: 400 });
        }

        // If role is TEACHER, verify their assignment
        if (role === "TEACHER") {
          const assignment = await prisma.teacherAssignment.findFirst({
            where: {
              teacherId: userId,
              gradeClassId: gradeClass.id,
              subjectId,
              year,
            },
          });

          if (!assignment) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
          }
        }

        return Promise.all(
          scores.map(async ({ assessmentType, score }) => {
            const numericMarks = parseFloat(score) || null;
            
            const existingResult = await prisma.result.findFirst({
              where: { studentId: student.id, subjectId, examType: assessmentType, year },
            });

            if (existingResult) {
              return prisma.result.update({
                where: { id: existingResult.id },
                data: {
                  marks: numericMarks,
                  updatedByTeacherId: role === "TEACHER" ? userId : null,
                  updatedByAdminId: role === "ADMIN" ? userId : null,
                },
              });
            } else {
              return prisma.result.create({
                data: {
                  studentId: student.id,
                  subjectId,
                  marks: numericMarks,
                  examType: assessmentType,
                  semester,
                  year,
                  createdByTeacherId: role === "TEACHER" ? userId : null,
                  createdByAdminId: role === "ADMIN" ? userId : null,
                },
              });
            }
          })
        );
      })
    );

    return NextResponse.json({ message: "Results saved successfully." });
  } catch (error) {
    console.error("Error processing results:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}