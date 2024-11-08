"use server"
import * as z from "zod"
import bcrypt from "bcryptjs"

import { teacherSchema} from "../schema";
import { error } from "console";
import prisma from "@/lib/prisma";
export const teacherRegister=async(values: z.infer<typeof teacherSchema>) => {
    const valdatedfields = teacherSchema.parse(values)
    if(!valdatedfields){
        return {error:"Invalid Credentials"}
    }

    const {username,password, name, surname, email, phone, address, img, bloodType, birthday, sex, role}=valdatedfields

    // const salt= await bcrypt.genSalt(10)
    // const hashedpassword=await bcrypt.hash(password,salt)
    
    const existingUser = await prisma.teacher.findUnique({
        where:{
            username
        }
      
    })
    const existingEmail = await prisma.teacher.findUnique({
        where:{
            email
        }
      
    }) 
    const existingPhone = await prisma.teacher.findUnique({
        where:{
            
            phone
        }
      
    })

    if(existingUser){
        return {error:"username already in use!"}
    }
    if(existingEmail){
        return {error:"email already in use!"}
    }
    if(existingPhone){
        return {error:"phone already in use!"}
    }
    await prisma.teacher.create({
        data:{
            username,
            password,
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
    })



    return {success:"account created successfully"} 
    
}