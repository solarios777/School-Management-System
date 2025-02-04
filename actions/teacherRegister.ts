"use server";

import bcrypt from "bcryptjs";
import { generateUsername } from "../hooks/counter";
import { TeacherSchema } from "../schema";
import prisma from "@/lib/prisma";

type CurrentState = {
  success?: boolean;
  error?: boolean;
  message?: string;
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
): Promise<{  password?: string; success: boolean; error: boolean; message: string }> => {
  try {
    // Check if email or phone already exists
    const existingTeacher = await prisma.teacher.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone },
        ],
      },
    });

    if (existingTeacher) {
      return {
        success: false,
        error: true,
        message: "Email or phone number already exists.",
      };
    }

    // Generate username
      const username = await generateUsername('TR'); 
    

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
    await prisma.teacher.create({
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
      message: "Teacher registered successfully.",
    };
  } catch (err) {
    console.error("Error while creating teacher:", err);

    return {
      success: false,
      error: true,
      message: "An unexpected error occurred.",
    };
  }
};



export const updateTeacher = async (
  currentState: CurrentState,
  
  data: Partial<TeacherSchema>
): Promise<{ success: boolean; error: boolean; message: string }> => {
  try {
    // Check if the teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id: data.id },
    });

    if (!existingTeacher) {
      return {
        success: false,
        error: true,
        message: "Teacher not found.",
      };
    }

    // Update the teacher data except the password
    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        // username: data.username || existingTeacher.username,
        name: data.name || existingTeacher.name,
        surname: data.surname || existingTeacher.surname,
        email: data.email || existingTeacher.email,
        phone: data.phone || existingTeacher.phone,
        address: data.address || existingTeacher.address,
        img: data.img || existingTeacher.img,
        bloodType: data.bloodType || existingTeacher.bloodType,
        birthday: data.birthday || existingTeacher.birthday,
        sex: data.sex || existingTeacher.sex,
        role: data.role || existingTeacher.role,
      },
    });

    return {
      success: true,
      error: false,
      message: "Teacher updated successfully.",
    };
  } catch (err) {
    console.error("Error while updating teacher:", err);

    return {
      success: false,
      error: true,
      message: "An unexpected error occurred.",
    };
  }
};