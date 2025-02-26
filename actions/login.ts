"use server";
import * as z from "zod";
import { LoginSchema } from "../schema";
import { signIn } from "../auth";
import prisma from "@/lib/prisma"; // Import Prisma
import { AuthError } from "next-auth";

type LoginResponse =
  | { success: true; redirectUrl: string; message: string }
  | { success: false; error: string };

export const Login = async (values: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
  const validatedFields = LoginSchema.parse(values);
  if (!validatedFields) {
    return { success: false, error: "Invalid Credentials" };
  }

  const { name, password, role } = validatedFields;

  try {
    // Find the user in the database
    const user = await prisma.student.findUnique({
      where: { username: name },
    });

    if (!user) {
      return { success: false, error: "User not found!" };
    }

    // Authenticate user
    const result = await signIn("credentials", {
      name,
      password,
      role, // Include role if necessary
      redirect: false, // Handle redirection manually
    });

    if (result?.error) {
      return { success: false, error: result.error }; // Return error if present
    }

    // Check if the user is logging in for the first time
    if (user.firstLogin === true) {
      return { 
        success: true, 
        redirectUrl: "/list/changePassword",
        message: "Welcome! Please change your password before continuing."
      };
    }

    // Redirect based on role
    const roleRedirectMap: Record<string, string> = {
      ADMIN: "/admin",
      STUDENT: "/student",
      TEACHER: "/teacher",
      PARENT: "/parent",
    };

    const redirectUrl = roleRedirectMap[user.role] || "/dashboard";

    return { 
      success: true, 
      redirectUrl,
      message: "Login successful! Redirecting..."
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid credentials!" };
        default:
          return { success: false, error: "Something went wrong!" };
      }
    }
    return { success: false, error: "An unexpected error occurred." };
  }
};
