import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import bcrypt from "bcrypt";
import { currentUser } from "@/lib/auth"; // Assuming you have an auth helper to get current user

export async function POST(req: Request) {
  try {
    const { currentPassword, username, role, newPassword } = await req.json();

    // Get current authenticated user
    const user = await currentUser();
    const userId = user?.id;
    const userRole = user?.role;

    // Check if the user is an admin
    if (!userId || userRole !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Fetch the admin's details
    const admin = await prisma.admin.findUnique({
      where: { id: userId },
    });

    if (!admin || !admin.password) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    // Compare the admin's current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Incorrect current password" }, { status: 401 });
    }

    // Capitalize first two letters of username (e.g., st/0111/25 → ST/0111/25)
    const formattedUsername = username.slice(0, 2).toUpperCase() + username.slice(2);

    // Find the user based on role
    let targetUser;

    if (role === "STUDENT") {
      targetUser = await prisma.student.findUnique({
        where: { username: formattedUsername },
      });
    } else if (role === "TEACHER") {
      targetUser = await prisma.teacher.findUnique({
        where: { username: formattedUsername },
      });
    } else if (role === "PARENT") {
      targetUser = await prisma.parent.findUnique({
        where: { username: formattedUsername },
      });
    } else {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    if (role === "STUDENT") {
      await prisma.student.update({
        where: { username: formattedUsername },
        data: { password: hashedPassword },
      });
    } else if (role === "TEACHER") {
      await prisma.teacher.update({
        where: { username: formattedUsername },
        data: { password: hashedPassword },
      });
    } else if (role === "PARENT") {
      await prisma.parent.update({
        where: { username: formattedUsername },
        data: { password: hashedPassword },
      });
    }

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
