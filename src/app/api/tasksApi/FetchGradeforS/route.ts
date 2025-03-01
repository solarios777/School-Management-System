import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const gradeClasses = await prisma.gradeClass.findMany({
      include: {
        grade: true,
        class: true,
        
      },
    });

    const formattedGradeClasses = gradeClasses.map((gc) => ({
      id: gc.id,
      grade: gc.grade.level,
      className: gc.class.name,
    }));

    return NextResponse.json(formattedGradeClasses, { status: 200 });
  } catch (error) {
    console.error("Error fetching grade classes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
