import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { currentUser } from "@/lib/auth"; // Ensure this fetches the current user

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    // Get user information from the current session
    const user = await currentUser();
    const userId = user?.id;
    const role = user?.role.toUpperCase();
  

    if (!userId || !role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Determine the user role and check the password in the correct table
    let userRecord: { password: string | null } | null = null;

    if (role === "ADMIN") {
      userRecord = await prisma.admin.findUnique({
        where: { id: userId },
        select: { password: true },
      });
    } else if (role === "TEACHER") {
      userRecord = await prisma.teacher.findUnique({
        where: { id: userId },
        select: { password: true },
      });
    } else if (role === "STUDENT") {
      userRecord = await prisma.student.findUnique({
        where: { id: userId },
        select: { password: true },
      });
    } else if (role === "PARENT") {
      userRecord = await prisma.parent.findUnique({
        where: { id: userId },
        select: { password: true },
      });
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // If user not found or has no password
    if (!userRecord || !userRecord.password) {
      return NextResponse.json({ error: "User not found or password not set" }, { status: 404 });
    }

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(currentPassword, userRecord.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password in the database
    if (role === "ADMIN") {
      await prisma.admin.update({ where: { id: userId }, data: { password: hashedNewPassword ,firstpass:"",firstLogin:false} });
    } else if (role === "TEACHER") {
      await prisma.teacher.update({ where: { id: userId }, data: { password: hashedNewPassword ,firstpass:"",firstLogin:false} });
    } else if (role === "STUDENT") {
      await prisma.student.update({ where: { id: userId }, data: { password: hashedNewPassword,firstpass:"",firstLogin:false} });
    } else if (role === "PARENT") {
      await prisma.parent.update({ where: { id: userId }, data: { password: hashedNewPassword,firstpass:"",firstLogin:false} });
    }

    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Password Change Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
