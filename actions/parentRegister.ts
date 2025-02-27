"use server";

import bcrypt from "bcryptjs";
import { generateUsername } from "../hooks/counter";
import { ParentSchema } from "../schema";
import prisma from "@/lib/prisma";


type CurrentState = {
  success?: boolean;
  error?: boolean;
  message?: string;
  password?: string;
};

export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
): Promise<CurrentState> => {
  try {
    // Check if email or phone already exists
    const existingParent = await prisma.parent.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone },
        ],
      },
    });

    if (existingParent) {
      return {
        success: false,
        error: true,
        message: "Email or phone number already exists.",
      };
    }

    // Generate username
      const username = await generateUsername('PR'); 
    

    // Generate a random password
   const generateRandomPassword = () => {
  const numbers = "0123456789";
  let password = "";
  for (let i = 0; i < 6; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return password;
};


    const password = generateRandomPassword();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the teacher record
    await prisma.parent.create({
      data: {
        username,
        password: hashedPassword,
        firstpass: password,
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
      message: "Parent registered successfully.",
    };
  } catch (err) {
    console.error("Error while creating Parent:", err);

    return {
      success: false,
      error: true,
      message: `An unexpected error occurred. ${err}`,
    };
  }
};