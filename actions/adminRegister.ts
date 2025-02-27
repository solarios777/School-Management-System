"use server"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { AdminSchema } from "../schema/index";
import prisma from "@/lib/prisma";



export const AdminRegister=async(values: z.infer<typeof AdminSchema>) => {
    const valdatedFields = AdminSchema.parse(values)
    if(!valdatedFields){
        return {error:"Invalid Credentials"}
    }

    const {username, name, surname, email, phone, address, img, bloodType, birthday, sex, role}=valdatedFields

    const generateRandomPassword = () => {
  const numbers = "0123456789";
  let password = "";
  for (let i = 0; i < 6; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return password;
};


    const password = generateRandomPassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await prisma.teacher.findUnique({
        where: { username }
    });
    const existingEmail = await prisma.teacher.findUnique({
        where: { email }
    });
    const existingPhone = await prisma.teacher.findUnique({
        where: { phone }
    });

    if (existingUser) {
        return { error: "Username already in use!" };
    }
    if (existingEmail) {
        return { error: "Email already in use!" };
    }
    if (existingPhone) {
        return { error: "Phone already in use!" };
    }

    await prisma.admin.create({
        data: {
            username,
            password: hashedPassword,
            firstpass: password,
            name,
            surname,
            email,
            phone,
            address,
            img,
            bloodType,
            birthday,
            sex,
            role
        }
    });
 
 
    return { 
        success: "Account created successfully", 
        password: `Password is: ${password}` 
    }; 
    
}