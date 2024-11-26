"use server"
import * as z from "zod"
import { studentEnrollmentSchema } from "../schema/index";
import prisma from "@/lib/prisma";


export const StudentEnrollment=async(values: z.infer<typeof studentEnrollmentSchema>) => {
    const valdatedFields = studentEnrollmentSchema.parse(values)
    if(!valdatedFields){
        return {error:"Invalid Credentials"}
    }

    const {studentname,grade,classname,year}=valdatedFields

    
 // Find the teacher by name
    const teacher = await prisma.student.findUnique({
        where: { username:studentname},
        select: { id: true } // Select only the ID
    });

    if (!teacher) {
        return { error: "Teacher not found" };
    }

    // Find the class by name
    const classId = await prisma.class.findUnique({
        where: { name: classname },
        select: { id: true } // Select only the ID
    });

    if (!classId) {
        return { error: "class not found" };
    }
    
    // Find the grade by name
    const gradeId = await prisma.grade.findUnique({
        where: { level: grade },
        select: { id: true } // Select only the ID
    });

    if (!gradeId) {
        return { error: "grade not found" };
    }
    // Find the subject by name
    

    // Create the teacher assignment
    await prisma.enrollment.create({
        data: {
            studentId: teacher.id, // Use the found teacher ID
            gradeId: gradeId.id,
            classId: classId.id,
            year

        }
    })
return { 
        success: "Student Enrolled successfully", 
        
    }; 
}