"use client";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { AdminSchema } from "../../../schema/index";
import { CardWrapper } from "./card_wrapper";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { Formsuccess } from "../form-success";
import { AdminRegister } from "../../../actions/adminRegister";
import InputField from "../InputField";


export const AdminRegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const { control, register, handleSubmit, formState: { errors } }  = useForm<z.infer<typeof AdminSchema>>({
    resolver: zodResolver(AdminSchema),
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
      role: "ADMIN",
    },
  });

  const onSubmit = (values: z.infer<typeof AdminSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      AdminRegister(values).then((res) => {
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
      headerLebel="Create an Admin Account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div className="space-y-4">
          <InputField
            register={register}
            error={errors.email}
            name="username"
            label="Username"
            placeholder="Enter your username"
            disabled={isPending}
          />
          <InputField
            register={register}
            error={errors.email}
            name="name"
            label="Name"
            placeholder="Enter your name"
            disabled={isPending}
          />
          <InputField
            register={register}
            error={errors.email}
            name="surname"
            label="Surname"
            placeholder="Enter your surname"
            disabled={isPending}
          />
          <InputField
            register={register}
            error={errors.email}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            disabled={isPending}
          />
          <InputField
            register={register}
            error={errors.email}
            name="phone"
            label="Phone"
            type="tel"
            placeholder="Enter your phone number"
            disabled={isPending}
          />
          <InputField
            register={register}
            error={errors.email}
            name="address"
            label="Address"
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
            register={register}
            error={errors.email}
            name="sex"
            label="Sex"
            type="select"
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
            ]}
            disabled={isPending}
          />
          <InputField
            register={register}
            error={errors.email}
            name="birthday"
            label="Birthday"
            type="date"
            disabled={isPending}
          />
          <InputField
            register={register}
            error={errors.email}
            name="role"
            label="Role"
            type="select"
            options={[
              { value: "ADMIN", label: "Admin" },
              { value: "TEACHER", label: "Teacher" },
            ]}
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
