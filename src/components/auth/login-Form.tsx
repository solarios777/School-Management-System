"use client";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import * as z from "zod";
import { LoginSchema } from "../../../schema/index";
import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { Login } from "../../../actions/login";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            name: "",
            password: "",
            role: "student",
        },
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        toast.dismiss(); // Dismiss previous toasts

        startTransition(async () => {
            try {
                const res = await Login(values);
                if (res?.success) {
                    toast.success(res.message || "✅ Login successful! Redirecting...");
                    setTimeout(() => {
                        window.location.href = res.redirectUrl;
                    }, 2000);
                } else {
                    toast.error(res?.error || "An unknown error occurred.");
                }
            } catch (error) {
                toast.error("An unexpected error occurred.");
                console.error("Login error:", error);
            }
        });
    };

    return (
        <CardWrapper
            headerLebel="Welcome"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
        >
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 bg-white">
                    <div className="space-y-4">
                        {/* Username Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Enter your username"
                                            className="input-bordered input w-full"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field with Show/Hide Toggle */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                placeholder="Enter your password"
                                                className="input-bordered input w-full pr-10"
                                                {...field}
                                                disabled={isPending}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-3 flex items-center"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Role Selection */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <select
                                            id="role"
                                            className="input-bordered input w-full"
                                            {...field}
                                            disabled={isPending}
                                        >
                                            <option value="student">Student</option>
                                            <option value="teacher">Teacher</option>
                                            <option value="parent">Parent</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Login Button */}
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
