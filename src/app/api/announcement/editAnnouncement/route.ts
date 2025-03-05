import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, isForWholeSchool, isForTeachers, isForParents, gradeIds, classIds } = body;

    // Validate required fields
    if (!id || !title || !description) {
      return NextResponse.json(
        { error: "ID, title, and description are required." },
        { status: 400 }
      );
    }

    // Validate at least one target audience is selected
    if (
      !isForWholeSchool &&
      !isForTeachers &&
      !isForParents &&
      (!gradeIds || gradeIds.length === 0) &&
      (!classIds || classIds.length === 0)
    ) {
      return NextResponse.json(
        { error: "Please select at least one target audience (whole school, teachers, parents, grades, or sections)." },
        { status: 400 }
      );
    }

    // Update the announcement in the database
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        description,
        isForWholeSchool,
        isForTeachers,
        isForParents,
        gradeIds,
        classIds,
      },
    });

    return NextResponse.json({ success: true, announcement: updatedAnnouncement }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { error: "Failed to update announcement", details: error.message },
      { status: 500 }
    );
  }
}