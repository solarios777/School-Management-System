"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { teacherSchema } from "../../../schema/index";
import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";
import InputField from "../InputField";
import { teacherRegister } from "../../../actions/teacherRegister";

export const TeacherForm = () => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { control, register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof teacherSchema>>({
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
  });

  const onSubmit = (values: z.infer<typeof teacherSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      teacherRegister(values).then((res) => {
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
      headerLebel="Create a Teacher Account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <InputField
            label="Username"
            name="username"
            register={register}
            error={errors.username}
            placeholder="Enter your username"
            disabled={isPending}
          />

          <InputField
            label="Name"
            name="name"
            register={register}
            error={errors.name}
            placeholder="Enter your name"
            disabled={isPending}
          />

          <InputField
            label="Surname"
            name="surname"
            register={register}
            error={errors.surname}
            placeholder="Enter your surname"
            disabled={isPending}
          />

          <InputField
            label="Email"
            name="email"
            register={register}
            error={errors.email}
            type="email"
            placeholder="Enter your email"
            disabled={isPending}
          />

          <InputField
            label="Phone"
            name="phone"
            register={register}
            error={errors.phone}
            type="tel"
            placeholder="Enter your phone number"
            disabled={isPending}
          />

          <InputField
            label="Address"
            name="address"
            register={register}
            error={errors.address}
            placeholder="Enter your address"
            disabled={isPending}
          />

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

          <InputField
            label="Sex"
            name="sex"
            as="select"
            register={register}
            error={errors.sex}
            disabled={isPending}
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
            ]}
          />

          <InputField
            label="Birthday"
            name="birthday"
            type="date"
            register={register}
            error={errors.birthday}
            disabled={isPending}
          />

          <InputField
            label="Role"
            name="role"
            as="select"
            register={register}
            error={errors.role}
            disabled={isPending}
            options={[
              { value: "TEACHER", label: "Teacher" },
              { value: "ADMIN", label: "Admin" },
            ]}
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
