import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, isForWholeSchool, isForTeachers, isForParents, gradeIds, classIds } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required." },
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

    // Create the announcement in the database
    const announcement = await prisma.announcement.create({
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

    return NextResponse.json({ success: true, announcement }, { status: 200 });
  } catch (error:any) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement", details: error.message },
      { status: 500 }
    );
  }
}