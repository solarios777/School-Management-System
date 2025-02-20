"use server"
import * as z from "zod"
import { TeacherAssignmentSchema, teacherAssignmentSchema } from "../schema/index";
import prisma from "@/lib/prisma";

type currentState={
  success?:boolean,
  error?:boolean,
  message?:string
}


export const createTeacherAssignment = async (
  currentState: currentState,
  data: TeacherAssignmentSchema
) => {
  try {
    const { teachername, subjectname, grade, classname, year } = data;

    const gradeClass = await prisma.gradeClass.findFirst({
      where: {
        gradeId: grade,
        classId: classname
      },
      select: {
        id: true,
      }
    });

    // Check if gradeClass exists
    if (!gradeClass) {
      return { success: false, error: true, message: "Grade and Class combination not found" };
    }

    await prisma.teacherAssignment.create({
      data: {
        teacherId: teachername,
        subjectId: subjectname,
        gradeClassId: gradeClass.id, // Extract ID here
        year
      }
    });
    
    return { success: true, error: false, message: "Teacher assigned successfully" };

  } catch (error) {
    console.error("Error in createTeacherAssignment:", error);
    return { success: false, error: true, message: "An unexpected error occurred" };
  }
}

