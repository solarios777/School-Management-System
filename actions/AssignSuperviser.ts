"use server";
import { SuperviserSchema } from "../schema/index";
import prisma from "@/lib/prisma";

type currentState = {
  success?: boolean;
  error?: boolean;
  message?: string;
};

export const createSuperviser = async (
  currentState: currentState,
  data: SuperviserSchema
) => {
  try {
    const { teachername, grade, classname, year } = data;

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

    const existingSupervisor = await prisma.superviser.findFirst({
      where: {
        gradeClassId: gradeClass.id,
        year,
      },
    });

    if (existingSupervisor) {
      return {
        success: false,
        error: true,
        message: "A supervisor is already assigned for this grade and section!",
      };
    }

    // Step 5: Create the Supervisor
    await prisma.superviser.create({
      data: {
        teacherId: teachername,
        gradeClassId: gradeClass.id,
        year,
      },
    });

    return {
      success: true,
      error: false,
      message: "Supervisor assigned successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred",
    };
  }
};
