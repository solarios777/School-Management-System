import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const latestRelease = await prisma.resultRelease.findFirst({
      where: { isReleased: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!latestRelease) {
      return NextResponse.json({ error: "No released results found" }, { status: 404 });
    }

    return NextResponse.json(latestRelease, { status: 200 });
  } catch (error) {
    console.error("Error fetching latest release:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
