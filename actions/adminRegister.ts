"use server"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { AdminSchema } from "../schema/index";
import prisma from "@/lib/prisma";
import { getUserByAdminname, getUserByEmail } from "../data/getUser";

export const AdminRegister=async(values: z.infer<typeof AdminSchema>) => {
    const valdatedFields = AdminSchema.parse(values)
    if(!valdatedFields){
        return {error:"Invalid Credentials"}
    }

    const {username,password}=valdatedFields

    const salt= await bcrypt.genSalt(10)
    const hashedpassword=await bcrypt.hash(password,salt)

    const existingUser = await getUserByAdminname(username)

    if(existingUser){
        return {error:"email already in use!"}
    }
    await prisma.admin.create({
        data:{
            username,
            password:hashedpassword,
            
        }
    })

    // TODO send verification email

    return {success:"user created!"}
    
}