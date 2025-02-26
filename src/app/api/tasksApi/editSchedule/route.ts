import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { startTime, endTime } = await req.json();
    const updatedSchedule = await prisma.schedule.update({
      where: { id: params.id },
      data: { startTime, endTime },
    });

    return NextResponse.json(updatedSchedule, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.schedule.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Schedule deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
