"use client";
// pages/student-registration.tsx
import React, { useState } from "react";

interface FormData {
  grade: string;
  class: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  emergencyContact: string;
  medicalInfo: string;
  previousSchool: string;
  admissionDate: string;
 
}

const StudentRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    grade: "",
    class: "",
    name: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    parentName: "",
    parentPhone: "",
    emergencyContact: "",
    medicalInfo: "",
    previousSchool: "",
    admissionDate: "",
    
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Student Registration</h2>
      <form onSubmit={handleSubmit}>
        

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="grade">
            Grade:<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formData.grade === "" && "border-red-500"
            }`}
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
          >
            <option value="">Select Grade</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
              <option key={grade} value={grade.toString()}>
                Grade {grade}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="class">
            Section:<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formData.class === "" && "border-red-500"
            }`}
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
          >
            <option value="">Section</option>
            {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(
              (letter) => (
                <option key={letter} value={letter}>
                  {letter}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Student Name:<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formData.name === "" && "border-red-500"
            }`}
            id="name"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="dateOfBirth"
          >
            Date of Birth:<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formData.dateOfBirth === "" && "border-red-500"
            }`}
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="gender"
          >
            Gender:<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formData.gender === "" && "border-red-500"
            }`}
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="address"
          >
            Address:<span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formData.address === "" && "border-red-500"
            }`}
            id="address"
            name="address"
            rows={3}
            placeholder="Enter Student Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
            Phone:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter Student Phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="email"
            placeholder="Enter Student Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="parentName"
          >
            Parent/Guardian Name:
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formData.parentName === "" && "border-red-500"
            }`}
            id="parentName"
            name="parentName"
            type="text"
            placeholder="Enter Parent/Guardian Name"
            value={formData.parentName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="parentPhone"
          >
            Parent/Guardian Phone:<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formData.parentPhone === "" && "border-red-500"
            }`}
            id="parentPhone"
            name="parentPhone"
            type="tel"
            placeholder="Enter Parent/Guardian Phone"
            value={formData.parentPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="emergencyContact"
          >
            Emergency Contact:<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formData.parentPhone === "" && "border-red-500"
            }`}
            id="emergencyContact"
            name="emergencyContact"
            type="text"
            placeholder="Enter Emergency Contact"
            value={formData.emergencyContact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="medicalInfo"
          >
            Medical Information:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="medicalInfo"
            name="medicalInfo"
            rows={3}
            placeholder="Enter Medical Information"
            value={formData.medicalInfo}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="previousSchool"
          >
            Previous School:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="previousSchool"
            name="previousSchool"
            type="text"
            placeholder="Enter Previous School"
            value={formData.previousSchool}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="admissionDate"
          >
            Admission Date:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="admissionDate"
            name="admissionDate"
            type="date"
            value={formData.admissionDate}
            onChange={handleChange}
          />
        </div>

       
       

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentRegistration;
