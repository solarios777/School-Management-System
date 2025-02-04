import bcrypt from "bcrypt";
import { ChangePasswordSchema } from "../schema";
import prisma from "@/lib/prisma";
import { getUserByUsernameForRole } from "../data/user";

type CurrentState = {
  success?: boolean;
  error?: boolean;
  message?: string;
};

export const changePassword = async (
  currentState: CurrentState,
  data: ChangePasswordSchema & { username: string; role: string }
) => {
  const { username, role, oldPassword, newPassword } = data;
  console.log(data);
  

  try {
    return {
      success: true,
      error: false,
      message: "occurred while changing the password.",
    };
    
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      error: true,
      message: "An error occurred while changing the password.",
    };
  }
};
