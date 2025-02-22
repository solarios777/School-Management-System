import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
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
        const { studentId, subjectId, examType, year, semester, scores, gradeId, classId } = entry;
        
        // Find the GradeClass ID
        const gradeClass = await prisma.gradeClass.findFirst({
          where: { gradeId, classId },
        });

        if (!gradeClass) {
          return NextResponse.json({ error: "Invalid grade or class" }, { status: 400 });
        }
        const grade = await prisma.grade.findUnique({
          where: { id: gradeId },
          select: { level: true },
        })
       
        const section = await prisma.class.findUnique({
          where: { id: classId },
          select: { name: true },
        })
         if (!grade || !section) {
          return NextResponse.json({ error: "Invalid grade or class" }, { status: 400 });
        }
        
        const student = await prisma.student.findUnique({
          where: { id: studentId },
          select: { name: true },
        })

        if (!student) {
          return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const enrollment = await prisma.enrollment.findFirst({
          where: { studentId, gradeClassId: gradeClass.id },
        });

        if (!enrollment) {
          return NextResponse.json({ error: `${student.name} is not enrolled in ${grade.level} ${section.name}` }, { status: 403 });
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
          scores.map(async ({ examType, marks }) => {
            const numericMarks = parseFloat(marks) || null;
            
            const existingResult = await prisma.result.findFirst({
              where: { studentId, subjectId, examType, year },
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
                  studentId,
                  subjectId,
                  marks: numericMarks,
                  examType,
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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
