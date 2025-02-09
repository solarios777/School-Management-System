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
    
    const asssignedSupervisor = await prisma.superviser.findFirst({
      where: {
        teacherId: teachername,
        year,
      },
    }); 
     if (asssignedSupervisor) {
      const gradeClass = await prisma.gradeClass.findUnique({
        where: {
          id: asssignedSupervisor.gradeClassId,
        },
      })
      const grade = await prisma.grade.findUnique({
        where: {
          id: gradeClass?.gradeId,
        },
      })
      const section= await prisma.class.findUnique({
        where: {
          id: gradeClass?.classId,
        },
      })
      return {
        success: false,
        error: true,
        message: `This teacher has already been assigned as a supervisor for SECTION ${grade?.level} ${section?.name}`,
      };
    }

    // if (existingSupervisor) {
    //   return {
    //     success: false,
    //     error: true,
    //     message: "A supervisor is already assigned for this grade and section!",
    //   };
    // }
    const alreadyAssigned = await prisma.superviser.findFirst({
      where: {
        gradeClassId: gradeClass.id,
        year,
      }
    })
    if (alreadyAssigned) {
     await prisma.superviser.update({
      where: {
            id: alreadyAssigned.id,
        },
      data: {
        teacherId: teachername,
      },
    });
    }
    else{
   await prisma.superviser.create({
      data: {
        teacherId: teachername,
        gradeClassId: gradeClass.id,
        year,
      },
    });
   }
    

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
