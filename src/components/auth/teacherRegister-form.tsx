"use client";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import{
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import * as z from "zod"


import { teacherSchema } from "../../../schema/index";

import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";

import { teacherRegister } from "../../../actions/teacherRegister";

export const TeacherForm = () => {
     const [isPending, startTransition] = useTransition();
     const [success, setSuccess] = useState("")
     const [password, setPassword] = useState("")

     const [error, setError] = useState("")

    const form = useForm<z.infer<typeof teacherSchema>>({
        resolver: zodResolver(teacherSchema),
        defaultValues: {
            username: "",
            name: "",
            surname: "",
            email: "",
            phone: "",
            address: "",
            img: "",
            bloodType: "",
            birthday: new Date(),
            sex: "MALE",
            role: "TEACHER", 
        },
    })

    const onSubmit = (values: z.infer<typeof teacherSchema>) => {
       setError("")
       setSuccess("")

        startTransition(() => {
            teacherRegister(values)
            .then((res) => {
                if(res.success){
                    setSuccess(res.success)
                    setPassword(res.password)
                    setError("")
                }
                if(res.error){
                    setError(res.error)
                    setSuccess("")
                }
            })
        }) 
    }
    return (
        <CardWrapper
            headerLebel="Create a Teacher Account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* Username Field */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            id="username"
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

                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Enter your name"
                                            className="input-bordered input w-full"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Surname Field */}
                        <FormField
                            control={form.control}
                            name="surname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Surname</FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            id="surname"
                                            placeholder="Enter your surname"
                                            className="input-bordered input w-full"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            className="input-bordered input w-full"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone Field */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <input
                                            type="tel"
                                            id="phone"
                                            placeholder="Enter your phone number"
                                            className="input-bordered input w-full"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address Field */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            id="address"
                                            placeholder="Enter your address"
                                            className="input-bordered input w-full"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Blood Type Field */}
                        <FormField
                            control={form.control}
                            name="bloodType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Blood Type</FormLabel>
                                    <FormControl>
                                        <select
                                            id="bloodType"
                                            className="input-bordered input w-full"
                                            {...field}
                                            disabled={isPending}
                                        >
                                            <option value="">Select Blood Type</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Sex Field */}
                        <FormField
                            control={form.control}
                            name="sex"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sex</FormLabel>
                                    <FormControl>
                                        <select
                                            id="sex"
                                            className="input-bordered input w-full"
                                            {...field}
                                            disabled={isPending}
                                        >
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Birthday Field */}
                        <FormField
  control={form.control}
  name="birthday"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Birthday</FormLabel>
      <FormControl>
        <input
          type="date"
          id="birthday"
          className="input-bordered input w-full"
          {...field}
          value={field.value ? field.value.toISOString().split('T')[0] : ''} // Convert Date to YYYY-MM-DD string
          disabled={isPending}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

                        {/* Role Field */}
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
                                            <option value="TEACHER">TEACHER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormError message={error} />
                    <Formsuccess message={success} />
                    <Formsuccess message={password} />

                    <Button type="submit" className="w-full" disabled={isPending}>Register</Button>
                </form>
            </Form>
        </CardWrapper>
    );
  };