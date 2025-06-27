import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "5");
    const offset = parseInt(searchParams.get("offset") ?? "0");
    const filter = searchParams.get("filter") || "all";
    const gradeId = searchParams.get("gradeId");
    const classId = searchParams.get("classId");

    let whereClause = {};

    if (filter === "teachers") {
      whereClause = { isForTeachers: true };
    } else if (filter === "parents") {
      whereClause = { isForParents: true };
    } else if (filter === "grade" && gradeId) {
      whereClause = { gradeIds: { has: gradeId } };
    } else if (filter === "section" && classId) {
      whereClause = { classIds: { has: classId } };
    }

    const announcements = await prisma.announcement.findMany({
      where: whereClause,
      orderBy: { date: "desc" }, // Last in, first out
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.announcement.count({ where: whereClause });

    return NextResponse.json({ announcements, totalCount }, { status: 200 });
  } catch (error:any) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements", details: error.message },
      { status: 500 }
    );
  }
}
