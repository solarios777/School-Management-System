import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const year = req.nextUrl.searchParams.get("year");
    const semester = req.nextUrl.searchParams.get("semester");
    const gradeId = req.nextUrl.searchParams.get("gradeId");
    const classId = req.nextUrl.searchParams.get("classId");

    if (!year || !semester || !gradeId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
    // Fetch students based on grade and optional class
    const students = await prisma.student.findMany({
      where: {
        enrollments: {
          some: {
            gradeClass: {
              gradeId,
              ...(classId ? { classId } : {}),
            },
          },
        },
      },
      select: {
        
        result: {
          where: { year, semester },
          include: { subject: true },
        },
      },
    });

    if (students.length === 0) {
      return NextResponse.json({ error: "No students found" }, { status: 404 });
    }
    console.log("students",students);
    return NextResponse.json({ students }, { status: 200 });
    
    

  } catch (error) {
    console.error("Error fetching student results:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
