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


import { subjectSchema } from "../../../schema/index";

import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";

import { subjectRegister } from "../../../actions/subjectRegister";

export const SubjectForm = () => {
     const [isPending, startTransition] = useTransition();
     const [success, setSuccess] = useState("")
     const [error, setError] = useState("")

    const form = useForm<z.infer<typeof subjectSchema>>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = (values: z.infer<typeof subjectSchema>) => {
       setError("")
       setSuccess("")

        startTransition(() => {
            subjectRegister(values)
            .then((res) => {
                if(res.success){
                    setSuccess(res.success)
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
            headerLebel="Create a subject"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* Username Field */}
                        
                         <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>subject</FormLabel>
                                    <FormControl>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Enter subject"
                                            className="input-bordered input w-full"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormError message={error} />
                    <Formsuccess message={success} />

                    <Button type="submit" className="w-full" disabled={isPending}>Register</Button>
                </form>
            </Form>
        </CardWrapper>
    );
  };