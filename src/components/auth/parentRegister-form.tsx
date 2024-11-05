"use client";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { parentSchema } from "@/lib/formValidationSchemas";
import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";
import { RegisterParent } from "../../../actions/parentRegister"; // Action to handle parent registration

export const ParentRegistrationForm = () => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof parentSchema>>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      username: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = (values: z.infer<typeof parentSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      RegisterParent(values)
        .then((res) => {
          if (res.success) {
            setSuccess(res.success);
            setError("");
          }
          if (res.error) {
            setError(res.error);
            setSuccess("");
          }
        });
    });
  };

  return (
    <CardWrapper
      headerLebel="Register a Parent"
      backButtonLabel="Go Back"
      backButtonHref="/auth/login" // Adjust as necessary
    >
      <Form
        {...form}   
      >
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
                  placeholder="Username"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />   
            </FormItem>
          )}
        />
        </div>
        </form>
        </Form>
    </CardWrapper>
  );
};