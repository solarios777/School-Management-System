import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure this is your Prisma client instance

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const semester = searchParams.get("semester");
    const year = searchParams.get("year");

    if (!studentId || !semester || !year) {
      return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
    }

    // Fetch student rank
    const rankRecord = await prisma.rank.findFirst({
      where: {
        studentId,
        semester: semester,
        year,
      },
      select: {
        rank: true,
      },
    });

    if (!rankRecord) {
      return NextResponse.json({ rank: null, message: "Rank not found" }, { status: 404 });
    }

    return NextResponse.json({ rank: rankRecord.rank }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student rank:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
