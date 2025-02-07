"use client";
import Image from "next/image";
import { useState } from "react";
// import {  SubjectRegisterForm } from "@/components/auth/subjectRegister-form";
// import { TeacherForm } from "@/components/auth/teacherRegister-form";
import { StudentRegisterForm } from "@/components/auth/studentRegister-form";
import { RegisterForm } from "@/components/auth/userRegister-form";
import { AdminRegisterForm } from "@/components/auth/adminRegister-form";
// import { TeacherAssignmentForm } from "@/components/auth/teacherAssign";
import { StudentEnrollmentForm } from "@/components/auth/studentEnrollment";
// import TeacherForm from "../../../auth/teacherRegister-form";
import TeacherRegistrationForm from "./teacher/page";
import { TeachernnnnnnnForm } from "@/components/auth/teacherRegister-form";
import EnrollStudentForm from "@/components/forms/EnrollStudentForm";

interface NavigationItem {
  icon: string;
  label: string;
  formComponent: JSX.Element; // Use JSX.Element to specify the component
}

const navigationItems: NavigationItem[] = [
  {
    icon: "/student.png",
    label: "Student",
    formComponent: <StudentRegisterForm/>, // Reference the form component
  },
  {
    icon: "/teacher.png",
    label: "Teacher",
    formComponent: <TeachernnnnnnnForm />, // Reference the form component
  },
  {
    icon: "/staff.png", // Changed icon to staff
    label: "Staff",
    formComponent: <RegisterForm />, // Reference the form component
  },
  // {
  //   icon: "/staff.png", // Changed icon to staff
  //   label: "subject",
  //   formComponent: <SubjectRegisterForm/>, // Reference the form component
  // },
  {
    icon: "/parent.png",
    label: "Parent",
    formComponent: <AdminRegisterForm />, // Reference the form component
  },
  //  {
  //   icon: "/parent.png",
  //   label: "Assign Teacher",
  //   formComponent: <TeacherAssignmentForm />, // Reference the form component
  // },
  //  {
  //   icon: "/parent.png",
  //   label: "enroll student",
  //   formComponent: <EnrollStudentForm/>, // Reference the form component
  // },
];

const NavigationPanel: React.FC = () => {
  const [activeForm, setActiveForm] = useState<JSX.Element | null>(null); // State to manage active form

  const handleOpenForm = (form: JSX.Element) => {
    setActiveForm(form);
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="hidden md:block text-lg font-semibold">
        Which one do you want to register?
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {navigationItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 bg-lamaYellow rounded-md hover:bg-lamaPurpleLight transition-colors duration-300 cursor-pointer"
            onClick={() => handleOpenForm(item.formComponent)} // Open the form on click
          >
            <Image src={item.icon} alt={item.label} width={32} height={32} />
            <span className="text-sm font-medium mt-2">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {activeForm} {/* Render the active form */}
      </div>
    </div>
  );
};

export default NavigationPanel;