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
  data: SectionSchema
) => {
  try {
    // Convert the subject name to uppercase
    const upperCaseName = data.name.toUpperCase();

    // Check if the subject already exists
    const existingClass = await prisma.class.findUnique({
      where: { name: upperCaseName },
    });

    if (existingClass) {
      return { success: false, error: true, message: "Section already exists!" };
    }

    // Create a new subject
    await prisma.class.create({
      data: { name: upperCaseName },
    });

    return { success: true, error: false, message: "Section created successfully" };
  } catch (err) {
    
    return { success: false, error: true, message: "An unexpected error occurred" };
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
