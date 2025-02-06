"use server";

import bcrypt from "bcryptjs";
import { generateUsername } from "../hooks/counter";
import { StudentSchema } from "../schema";
import prisma from "@/lib/prisma";


type CurrentState = {
  success?: boolean;
  error?: boolean;
  message?: string;
  password?: string;
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
): Promise<CurrentState> => {
  try {
    // Check if email or phone already exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone },
        ],
      },
    });

    if (existingStudent) {
      return {
        success: false,
        error: true,
        message: "Email or phone number already exists.",
      };
    }

    // Generate username
      const username = await generateUsername('ST'); // Change 'ST' to 'TR' or 'PR' as needed
    console.log(`Generated Username: ${username}`);
    

    // Generate a random password
    const generateRandomPassword = () => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 6; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return password;
    };

    const password = generateRandomPassword();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the teacher record
    await prisma.student.create({
      data: {
        username,
        password: hashedPassword,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        role: data.role,
      },
    });

    // Return success response with username and password
    return {
      password,
      success: true,
      error: false,
      message: "Student registered successfully.",
    };
  } catch (err) {
    console.error("Error while creating Student:", err);

    return {
      success: false,
      error: true,
      message: "An unexpected error occurred.",
    };
  }
};
export const updateStudent = async (
  currentState: CurrentState,
  
  data: Partial<StudentSchema>
): Promise<{ success: boolean; error: boolean; message: string }> => {
  try {
    // Check if the teacher exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: data.id },
    });

    if (!existingStudent) {
      return {
        success: false,
        error: true,
        message: "Student not found.",
      };
    }

    // Update the teacher data except the password
    await prisma.student.update({
      where: { id: data.id },
      data: {
        // username: data.username || existingTeacher.username,
        name: data.name || existingStudent.name,
        surname: data.surname || existingStudent.surname,
        email: data.email || existingStudent.email,
        phone: data.phone || existingStudent.phone,
        address: data.address || existingStudent.address,
        img: data.img || existingStudent.img,
        bloodType: data.bloodType || existingStudent.bloodType,
        birthday: data.birthday || existingStudent.birthday,
        sex: data.sex || existingStudent.sex,
        role: data.role || existingStudent.role,
      },
    });

    return {
      success: true,
      error: false,
      message: "Student updated successfully.",
    };
  } catch (err) {
    console.error("Error while updating Student:", err);

    return {
      success: false,
      error: true,
      message: "An unexpected error occurred.",
    };
  }
};
