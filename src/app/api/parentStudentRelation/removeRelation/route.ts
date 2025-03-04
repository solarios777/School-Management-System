// app/api/remove-parent/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { studentId, parentId } = await request.json();

    // Validate input
    if (!studentId || !parentId) {
      return NextResponse.json(
        { error: 'Student ID and parent ID are required' },
        { status: 400 }
      );
    }

    // Remove the relationship
    const deletedRelationship = await prisma.studentParent.delete({
      where: {
        studentId_parentId: {
          studentId,
          parentId,
        },
      },
    });

    return NextResponse.json({
      message: 'Parent relationship removed successfully',
      relationship: deletedRelationship,
    });
  } catch (error) {
    console.error('Error removing parent relationship:', error);
    return NextResponse.json(
      { error: 'Failed to remove parent relationship' },
      { status: 500 }
    );
  }
}