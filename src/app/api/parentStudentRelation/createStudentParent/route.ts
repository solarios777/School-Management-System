// app/api/update-parent/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { studentName, studentUsername, parentId } = await request.json();

    // Validate input
    if (!studentName || !studentUsername || !parentId) {
      return NextResponse.json(
        { error: 'Student name, username, and parent ID are required' },
        { status: 400 }
      );
    }

    // Find the student by name and username
    const student = await prisma.student.findFirst({
      where: {
        name: studentName,
        username: studentUsername,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Update the student's parentId
    const updatedStudent = await prisma.student.update({
      where: { id: student.id },
      data: { parentId },
    });

    return NextResponse.json({
      message: 'Parent relationship created successfully',
      student: updatedStudent,
    });
  } catch (error) {
    console.error('Error updating parent relationship:', error);
    return NextResponse.json(
      { error: 'Failed to update parent relationship' },
      { status: 500 }
    );
  }
}