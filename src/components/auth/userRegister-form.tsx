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


import { RegisterSchema } from "@/lib/formValidationSchemas";

import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";

import { Register } from "../../../actions/userRegister";

export const RegisterForm = () => {
     const [isPending, startTransition] = useTransition();
     const [success, setSuccess] = useState("")
     const [error, setError] = useState("")

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "", 
        },
    })


    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
       setError("")
       setSuccess("")

        startTransition(() => {
            Register(values)
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
   return(
    <CardWrapper
    headerLebel="create an account"
    backButtonLabel="already have an account?"
    backButtonHref="/auth/login" 
    >
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input
                    type="text"
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
          
        </div>
          
          <FormError message={error}/>
          <Formsuccess message={success}/>
             
                    <Button type="submit" className="w-full" disabled={isPending}>Register</Button>
          
        </form>
      </Form>
      
    </CardWrapper>
   )
  };