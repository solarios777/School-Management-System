"use server"
import * as z from "zod"

import { subjectSchema} from "../schema";

import prisma from "@/lib/prisma";
export const subjectRegister=async(values: z.infer<typeof subjectSchema>) => {
    const valdatedfields = subjectSchema.parse(values)
    if(!valdatedfields){
        return {error:"Invalid Credentials"}
    }

    const {name}=valdatedfields

    const upperCaseName = name.toUpperCase();
    
    const existingSubject = await prisma.subject.findUnique({
        where:{
            name
        }
      
    })
   
    if(existingSubject){
        return {error:"subject already exists!"}
    }

    

    await prisma.subject.create({
        data:{
            name:upperCaseName,
           
        }
    })



    return {success:"account created successfully"} 
    
}