import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const timetable = await prisma.periodTimetable.findMany({
      orderBy: { rollNo: "asc" }, // Ensure ordered data
    });

    return NextResponse.json({ timetable }, { status: 200 });
  } catch (error) {
    console.error("Error fetching period timetable:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
