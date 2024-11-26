"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { subjectSchema } from "../../../schema/index";
import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";
import InputField from "../InputField";
import { subjectRegister } from "../../../actions/subjectRegister";

export const SubjectRegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof subjectSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      subjectRegister(values).then((res) => {
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
      headerLebel="Create a Subject"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <h1 className="text-xl font-semibold">Create a New Subject</h1>

        <InputField
          label="Subject Name"
          name="name"
          placeholder="Enter subject name"
          register={register}
          error={errors.name}
          disabled={isPending}
        />

        <FormError message={error} />
        <Formsuccess message={success} />

        <Button type="submit" className="w-full" disabled={isPending}>
          Register
        </Button>
      </form>
    </CardWrapper>
  );
};
