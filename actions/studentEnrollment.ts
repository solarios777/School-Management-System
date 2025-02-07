"use server";
import { StudentEnrollmentSchema } from "../schema/index";
import prisma from "@/lib/prisma";

type currentState = {
  success?: boolean;
  error?: boolean;
  message?: string;
};

export const EnrollStudent = async (
  currentState: currentState,
  data: StudentEnrollmentSchema
) => {
  try {
    const { studentname, grade, classname, year,id } = data;

    const gradeEntry = await prisma.grade.findFirst({
      where: { level: Number(grade) },
    });

    if (!gradeEntry) {
      return { success: false, error: true, message: "Grade not found!" };
    }

    
    const gradeClass = await prisma.gradeClass.findFirst({
      where: {
        gradeId: gradeEntry.id,
        classId: classname,
      },
    });

    if (!gradeClass) {
      return { success: false, error: true, message: "Grade and Section combination not found!" };
    }

   const existingEnrollment = await prisma.enrollment.findFirst({
       where: {
           studentId: studentname,
       }
   })
   if(existingEnrollment){
    await prisma.enrollment.update({
        where: {
            id: existingEnrollment.id,
        },
        data: {
            gradeClassId: gradeClass.id,
            year: year,
        },
    })
   }
   else{
    await prisma.enrollment.create({
      data: {
        studentId: studentname,
        gradeClassId: gradeClass.id,
        year: year,
      },
    });
   }

    return {
      success: true,
      error: false,
      message: "student enrolled successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred",
    };
  }
};
