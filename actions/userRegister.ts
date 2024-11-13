"use server"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { RegisterSchema } from "../schema/index";
import prisma from "@/lib/prisma";
import { getUserByEmail } from "../data/getUser";

export const Register=async(values: z.infer<typeof RegisterSchema>) => {
    const valdatedFields = RegisterSchema.parse(values)
    if(!valdatedFields){
        return {error:"Invalid Credentials"}
    }

    const {email,password, name}=valdatedFields

    const salt= await bcrypt.genSalt(10)
    const hashedpassword=await bcrypt.hash(password,salt)

    const existingUser = await getUserByEmail(email)

    if(existingUser){
        return {error:"email already in use!"}
    }
    await prisma.user.create({
        data:{
            email,
            password:hashedpassword,
            name
        }
    })

    // TODO send verification email

    return {success:"user created!"}
    
}