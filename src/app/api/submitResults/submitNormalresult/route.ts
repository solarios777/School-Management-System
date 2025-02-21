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
        const { studentId, subjectId, examType, year, semester, scores } = entry;

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
    console.error("Error processing results:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
