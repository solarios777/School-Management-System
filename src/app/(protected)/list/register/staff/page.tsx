"use client";

// pages/teacher-registration.tsx
import { useState } from "react";

const TeacherRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    contactInformation: "",
    jobTitle: "",
    qualifications: "",
    hiringDate: "",
    attendanceRecords: "",
    performanceEvaluations: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="max-w-2xl mx-[5%] lg:mx-[10%] xl:mx-[15%] my-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Staff Registration</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-bold mb-2">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dateOfBirth" className="block font-bold mb-2">
            Date of Birth<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="gender" className="block font-bold mb-2">
            Gender<span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block font-bold mb-2">
            Address<span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="contactInformation" className="block font-bold mb-2">
            Contact Information<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contactInformation"
            name="contactInformation"
            value={formData.contactInformation}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="jobTitle" className="block font-bold mb-2">
            Job Title/Role<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="qualifications" className="block font-bold mb-2">
            Qualifications (if applicable)
          </label>
          <textarea
            id="qualifications"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="hiringDate" className="block font-bold mb-2">
            Hiring Date<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="hiringDate"
            name="hiringDate"
            value={formData.hiringDate}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>
        
        <div className="mb-4">
          <label
            htmlFor="performanceEvaluations"
            className="block font-bold mb-2"
          >
            Performance Evaluations
          </label>
          <textarea
            id="performanceEvaluations"
            name="performanceEvaluations"
            value={formData.performanceEvaluations}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default TeacherRegistration;
