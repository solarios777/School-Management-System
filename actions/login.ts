"use server"
import * as z from "zod"
import { LoginSchema } from "../schema";
import { error } from "console";
export const Login=async(values: z.infer<typeof LoginSchema>) => {
    const valdatedfields = LoginSchema.parse(values)
    if(!valdatedfields){
        return {error:"Invalid Credentials"}
    }
    return {success:"Login Success"}
    
}