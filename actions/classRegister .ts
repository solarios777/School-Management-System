"use server";

// import * as z from "zod";
import { SectionSchema } from "../schema";
import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";

type currentState={
  success?:boolean,
  error?:boolean,
  message?:string
}


 
// create subject
export const createSection = async (
  currentState: currentState,
  data: SectionSchema // Section name is provided
) => {
  try {
    // Convert the section name to uppercase
    const upperCaseName = data.name.toUpperCase();

    // Check if the section (class) already exists
    const existingClass = await prisma.class.findUnique({
      where: { name: upperCaseName },
    });

    if (existingClass) {
      return { success: false, error: true, message: "Section already exists!" };
    }

    // Create the new section in the Class table
    const newClass = await prisma.class.create({
      data: { name: upperCaseName },
    });

    // Fetch all existing grades
    const grades = await prisma.grade.findMany();

    if (!grades.length) {
      return { success: false, error: true, message: "No grades found to associate with the section." };
    }

    // Create GradeClass entries for each grade
    const gradeClassPromises = grades.map((grade) =>
      prisma.gradeClass.create({
        data: {
          gradeId: grade.id,
          classId: newClass.id, // Link to the newly created class
        },
      })
    );

    // Wait for all GradeClass entries to be created
    await Promise.all(gradeClassPromises);

    return { success: true, error: false, message: "Section added successfully for all grades." };
  } catch (err) {
    console.error("Error creating section for all grades:", err);
    return { success: false, error: true, message: "An unexpected error occurred while creating the section." };
  }
};



// update subject

export const updateSection = async (
  currentState: currentState,
  data: SectionSchema & { id: string } // Ensure `id` is required for updates
) => {
  
  try {
    
    const upperCaseName = data.name.toUpperCase();

    // Check if a subject with the new name already exists (but is not the same record)
    const existingClass = await prisma.class.findFirst({
      where: {
        name: upperCaseName,
        NOT: { id: data.id }, // Exclude the current record from the check
      },
    });
    if (existingClass) {
      return {
        success: false,
        error: true,
        message: "Another class with the same name already exists!",
      };
    }
    // Perform the update
    await prisma.class.update({
      where: { id: data.id },
      data: { name: upperCaseName },
    });

    return { success: true, error: false, message: `Section updated successfully` };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred during the update",
    };
  }
};


// delete subject
export const deleteSection = async (
  currentState: currentState,
  data: FormData// Ensure `id` is required for updates
) => {
  const id = data.get("id") as string;
  try {
    
    // Perform the update
    await prisma.class.delete({
      where: { id: id}
    });

    return { success: true, error: false, message: `Section deleted successfully ` };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred during the update",
    };
  }
};
