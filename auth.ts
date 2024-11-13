import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"

import prisma from "@/lib/prisma"

import { getUserById } from "./data/getUser"
import { DefaultSession } from "next-auth"
 
// const prisma = new PrismaClient()
  type UserRole = "admin" | "teacher" | "student" | "parent" | "user";
declare module "next-auth" {
  
  interface Session {
    user: {
      role: string
      
    } & DefaultSession["user"]
  }
}
export const { auth, handlers, signIn, signOut } = NextAuth({
 callbacks: {
    async session({ session, token }) {
     
      
      if(token.sub && session.user){
        session.user.id = token.sub
        
      }
      if(token.role && session.user){
        session.user.role = token.role as "ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "USER";
      }
      if (token.name && session.user) { // Ensure 'name' is part of the token
        session.user.name = token.name; // Add username to session
    }
      return session
    },
    async jwt({ token }) {
     if(!token.sub) return token
      const existingUser = await getUserById(token.sub)


      if(!existingUser) return token

      token.role = existingUser.role
      token.name = existingUser.username
      
      return token
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})