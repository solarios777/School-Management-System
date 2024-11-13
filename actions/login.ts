"use server";
import * as z from "zod";
import { LoginSchema } from "../schema";
import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { AuthError } from "next-auth";

type LoginResponse = 
    | { success: true; redirectUrl: string }
    | { success: false; error: string };

export const Login = async (values: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
    const validatedFields = LoginSchema.parse(values);
    if (!validatedFields) {
        return { success: false, error: "Invalid Credentials" };
    }

    const { name, password, role } = validatedFields;

    try {
        const result = await signIn("credentials", {
            name,
            password,
            role, // Include role if necessary
            redirect: false, // Handle redirection manually
        });

        if (result?.error) {
            return { success: false, error: result.error }; // Return error if present
        } else {
            // Redirect to a specific URL after successful login
            return { success: true, redirectUrl: DEFAULT_LOGIN_REDIRECT }; 
        }

    } catch (error) {
        // Log the error for debugging
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