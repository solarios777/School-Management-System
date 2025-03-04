// app/api/update-parent/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { studentId, parentId } = await request.json();

    // Validate input
    if (!studentId || !parentId) {
      return NextResponse.json(
        { error: 'Student ID and Parent ID are required' },
        { status: 400 }
      );
    }

    // Check if the relationship already exists
    const existingRelationship = await prisma.studentParent.findUnique({
      where: {
        studentId_parentId: {
          studentId,
          parentId,
        },
      },
    });

    if (existingRelationship) {
      return NextResponse.json(
        { error: 'Relationship already exists' },
        { status: 400 }
      );
    }

    // Create the new relationship
    const newRelationship = await prisma.studentParent.create({
      data: {
        studentId,
        parentId,
      },
    });

    return NextResponse.json({
      message: 'Parent relationship created successfully',
      relationship: newRelationship,
    });
  } catch (error) {
    console.error('Error updating parent relationship:', error);
    return NextResponse.json(
      { error: 'Failed to update parent relationship' },
      { status: 500 }
    );
  }
}