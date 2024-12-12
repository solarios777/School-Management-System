"use server"
import * as z from "zod"
import { SuperviserSchema } from "../schema/index";
import prisma from "@/lib/prisma";

type currentState={
  success?:boolean,
  error?:boolean,
  message?:string
}



export const createSuperviser = async (
  currentState: currentState,
  data: SuperviserSchema
) => {
    
    try {
        const {teachername,grade,classname,year}=data

    
    // Find the grade by name
    const gradeId = await prisma.grade.findUnique({
        where: { level: grade },
        select: { id: true } // Select only the ID
    });

    if (!gradeId) {
        return { success: false, error: true, message: "Grade not found!" };
    }
    // Find the subject by name
   
        await prisma.superviser.create({
        data: {
            teacherId: teachername, 
            gradeId: gradeId.id,
            classId: classname,
            year

        }
    }) 
    return { success: true, error: false, message: "Homeroom teacher assigned successfully" };

    } catch (error) {
    return { success: false, error: true, message: "An unexpected error occurred" }; 
    }
}

