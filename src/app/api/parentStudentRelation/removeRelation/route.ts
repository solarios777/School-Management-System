// app/api/remove-parent/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { studentId } = await request.json();

    // Validate input
    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Remove the parent relationship by setting parentId to null
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { parentId: null },
    });

    return NextResponse.json({
      message: 'Parent relationship removed successfully',
      student: updatedStudent,
    });
  } catch (error) {
    console.error('Error removing parent relationship:', error);
    return NextResponse.json(
      { error: 'Failed to remove parent relationship' },
      { status: 500 }
    );
  }
}