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
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";
import { Login } from "../../../actions/login";

export const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            name: "",
            password: "",
            role: "student", // Set a default role
        },
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
        try {
            const res = await Login(values);
            if (res && res.success) {
                setSuccess("🔑Login successful!🔓");
                setError("");
            } else if (res && res.error) {
                setError(res.error);
                setSuccess("");
            } else {
                setError("An unknown error occurred.");
            }
        } catch (error) {
            setError("An unexpected error occurred.");
            console.error("Login error:", error);
        }
    });
};

    return (
        <CardWrapper
            headerLebel="welcome"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder="Enter your password"
                                            className="input-bordered input w-full"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                            <option value="user">User</option>
                                            <option value="parent">Parent</option>
                                            <option value="student">Student</option>
                                            <option value="teacher">Teacher</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <Formsuccess message={success} />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};