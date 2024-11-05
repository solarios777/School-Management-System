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


import { LoginSchema } from "@/lib/formValidationSchemas";

import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";

import { Login } from "../../../actions/login";

export const LoginForm = () => {
     const [isPending, startTransition] = useTransition();
     const [success, setSuccess] = useState("")
     const [error, setError] = useState("")

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
       setError("")
       setSuccess("")

        startTransition(() => {
            Login(values)
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
    headerLebel="welcome"
    backButtonLabel="Don't have an account?"
    backButtonHref="/auth/register" 
    >
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
          </div>
          <FormError message={error}/>
          <Formsuccess message={success}/>
             
                    <Button type="submit" className="w-full" disabled={isPending}>Login</Button>
          
        </form>
      </Form>
      
    </CardWrapper>
   )
  };