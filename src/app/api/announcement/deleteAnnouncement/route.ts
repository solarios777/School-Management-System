import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "ID is required to delete the announcement." },
        { status: 400 }
      );
    }

    // Check if the announcement exists
    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found." },
        { status: 404 }
      );
    }

    // Delete the announcement from the database
    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Announcement deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement", details: error.message },
      { status: 500 }
    );
  }
}