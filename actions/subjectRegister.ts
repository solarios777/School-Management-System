"use server";

// import * as z from "zod";
import { SubjectSchema, subjectSchema } from "../schema";
import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";

type currentState={
  success?:boolean,
  error?:boolean,
  message?:string
}


 
// create subject
export const createSubject = async (
  currentState: currentState,
  data: SubjectSchema
) => {
  try {
    // Convert the subject name to uppercase
    const upperCaseName = data.name.toUpperCase();

    // Check if the subject already exists
    const existingSubject = await prisma.subject.findUnique({
      where: { name: upperCaseName },
    });

    if (existingSubject) {
      return { success: false, error: true, message: "Subject already exists!" };
    }

    // Create a new subject
    await prisma.subject.create({
      data: { name: upperCaseName },
    });

    return { success: true, error: false, message: "Subject created successfully" };
  } catch (err) {
    console.log("error",err);
    
    return { success: false, error: true, message: "An unexpected error occurred" };
  }
};



// update subject

export const updateSubject = async (
  currentState: currentState,
  data: SubjectSchema & { id: string } // Ensure `id` is required for updates
) => {
  
  try {
    
    const upperCaseName = data.name.toUpperCase();

    // Check if a subject with the new name already exists (but is not the same record)
    const existingSubject = await prisma.subject.findFirst({
      where: {
        name: upperCaseName,
        NOT: { id: data.id }, // Exclude the current record from the check
      },
    });

    if (existingSubject) {
      return {
        success: false,
        error: true,
        message: "Another subject with the same name already exists!",
      };
    }
    // Perform the update
    await prisma.subject.update({
      where: { id: data.id },
      data: { name: upperCaseName },
    });

    return { success: true, error: false, message: `Subject updated successfully` };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred during the update",
    };
  }
};


// delete subject
export const deleteSubject = async (
  currentState: currentState,
  data: FormData// Ensure `id` is required for updates
) => {
  const id = data.get("id") as string;
  try {
    
    // Perform the update
    await prisma.subject.delete({
      where: { id: id}
    });

    return { success: true, error: false, message: `Subject deleted successfully ` };
  } catch (err) {
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred during the update",
    };
  }
};
