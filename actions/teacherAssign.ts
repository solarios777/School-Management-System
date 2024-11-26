"use server"
import * as z from "zod"
import { teacherAssignmentSchema } from "../schema/index";
import prisma from "@/lib/prisma";


export const TeacherAssign=async(values: z.infer<typeof teacherAssignmentSchema>) => {
    const valdatedFields = teacherAssignmentSchema.parse(values)
    if(!valdatedFields){
        return {error:"Invalid Credentials"}
    }

    const {teachername,subjectname,grade,classname,year}=valdatedFields

    
 // Find the teacher by name
    const teacher = await prisma.teacher.findUnique({
        where: { username:teachername},
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
    const subjectId = await prisma.subject.findUnique({
        where: { name: subjectname },
        select: { id: true } // Select only the ID
    });

    if (!subjectId) {
        return { error: "subject not found" };
    }

    // Create the teacher assignment
    await prisma.teacherAssignment.create({
        data: {
            teacherId: teacher.id, // Use the found teacher ID
            subjectId: subjectId.id,
            gradeId: gradeId.id,
            classId: classId.id,
            year

        }
    })
return { 
        success: "Teacher assigned successfully", 
        
    }; 
}