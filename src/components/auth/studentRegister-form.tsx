"use client";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { studentSchema } from "../../../schema/index";
import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";
import { studentRegister } from "../../../actions/studentRegister";
import InputField from "../InputField";
// Reusable input field component

export const StudentForm = () => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const { control, register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      surname: "",
      phone: "",
      address: "",
      img: "",
      bloodType: "",
      birthday: new Date(),
      sex: "MALE",
      role: "STUDENT",
    },
  });

  const onSubmit = (values: z.infer<typeof studentSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      studentRegister(values).then((res) => {
        if (res.success) {
          setSuccess(res.success);
          setPassword(res.password);
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
      headerLebel="Create a Student Account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Username Field */}
          <InputField
            register={register}
            name="username"
            label="Username"
            type="text"
            placeholder="Enter your username"
            disabled={isPending}
          />

          {/* Name Field */}
          <InputField
            register={register}
            name="name"
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            disabled={isPending}
          />

          {/* Surname Field */}
          <InputField
            register={register}
            name="surname"
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            disabled={isPending}
          />

          {/* Email Field */}
          <InputField
            register={register}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            disabled={isPending}
          />

          {/* Phone Field */}
          <InputField
            register={register}
            name="phone"
            label="Phone"
            type="tel"
            placeholder="Enter your phone number"
            disabled={isPending}
          />

          {/* Address Field */}
          <InputField
            register={register}
            name="address"
            label="Address"
            type="text"
            placeholder="Enter your address"
            disabled={isPending}
          />

          {/* Blood Type Field */}
          <InputField
            label="Blood Type"
            name="bloodType"
            as="select"
            register={register}
            error={errors.bloodType}
            disabled={isPending}
            options={[
              { value: "", label: "Select Blood Type" },
              { value: "A+", label: "A+" },
              { value: "A-", label: "A-" },
              { value: "B+", label: "B+" },
              { value: "B-", label: "B-" },
              { value: "O+", label: "O+" },
              { value: "O-", label: "O-" },
              { value: "AB+", label: "AB+" },
              { value: "AB-", label: "AB-" },
            ]}
          />

          {/* Sex Field */}
          <InputField
            register={register}
            name="sex"
            label="Sex"
            type="select"
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
            ]}
            disabled={isPending}
          />

          {/* Birthday Field */}
          <InputField
            register={register}
            name="birthday"
            label="Birthday"
            type="date"
            placeholder="YYYY-MM-DD"
            disabled={isPending}
          />

          {/* Role Field */}
          <InputField
            register={register}
            name="role"
            label="Role"
            type="select"
            options={[{ value: "STUDENT", label: "Student" }]}
            disabled={isPending}
          />
        </div>

        <FormError message={error} />
        <Formsuccess message={success} />
        <Formsuccess message={password} />

        <Button type="submit" className="w-full" disabled={isPending}>
          Register
        </Button>
      </form>
    </CardWrapper>
  );
};
