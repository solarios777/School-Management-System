"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { AdminChangePassword } from "@/app/_services/changePassword"; // ✅ Import API Function
import "react-toastify/dist/ReactToastify.css";

// Validation Schema
const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Admin password is required"),
  username: z.string().min(3, "Username is required"),
  role: z.enum(["STUDENT", "TEACHER", "PARENT", "ADMIN"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
  newPassword: z.string().min(4, "New password must be at least 4 characters long"),
});

type PasswordSchema = z.infer<typeof passwordSchema>;

const AdminChangePasswordForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // ✅ Fixed Submission to Correctly Call the API Function
  const onSubmit = async () => {
    const { currentPassword, username, role, newPassword } = getValues();

    try {
      await AdminChangePassword(currentPassword, newPassword, username, role);
      toast.success("Password changed successfully!");
      setOpenDialog(false);
    } catch (error: any) {
      toast.error(error || "Failed to change password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">🔒 Admin Password Reset</h2>
        <p className="text-center text-gray-600">Reset password for user</p>

        {/* Admin Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">🔑 Admin Current Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              {...register("currentPassword")}
              placeholder="Enter your current password"
              className="pr-10"
            />
            <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-2 flex items-center text-gray-500">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">👤 Username</label>
          <Input {...register("username")} placeholder="Enter the username of the user" />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">📌 User Role</label>
          <Select onValueChange={(value) => setValue("role", value as "STUDENT" | "TEACHER" | "PARENT" | "ADMIN")}>
            <SelectTrigger>
              <SelectValue placeholder="Select user role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STUDENT">Student</SelectItem>
              <SelectItem value="TEACHER">Teacher</SelectItem>
              <SelectItem value="PARENT">Parent</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">🔐 New Password</label>
          <Input {...register("newPassword")} type="text" placeholder="Enter a simple new password for the user" />
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
        </div>

        {/* Open Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200" onClick={handleSubmit(() => setOpenDialog(true))}>
              Reset Password
            </Button>
          </DialogTrigger>

          {/* Confirmation Dialog */}
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>⚠️ Confirm Password Reset</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 text-center">Are you sure you want to reset this user’s password?</p>

            <DialogFooter className="flex justify-center">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={onSubmit}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
};

export default AdminChangePasswordForm;
