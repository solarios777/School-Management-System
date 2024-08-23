"use client";
// pages/parent-registration.tsx
import { useState } from "react";

const ParentRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    parentName: "",
    studentName: "",
    parentContactInformation: "",
    relationship: "",
    emergencyContact: "",
    schoolActivities: "",
    feedback: "",
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
      <h1 className="text-2xl font-bold mb-6">Parent Registration</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="parentName" className="block font-bold mb-2">
            Parent Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            value={formData.parentName}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="parentName" className="block font-bold mb-2">
            student Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            value={formData.studentName}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="parentContactInformation"
            className="block font-bold mb-2"
          >
            Parent Contact Information (phone, email)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="parentContactInformation"
            name="parentContactInformation"
            value={formData.parentContactInformation}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="relationship" className="block font-bold mb-2">
            Relationship to Student(s)<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="relationship"
            name="relationship"
            value={formData.relationship}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="emergencyContact" className="block font-bold mb-2">
            Emergency Contact Information<span className="text-red-500">*</span>
          </label>
          <textarea
            id="emergencyContact"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="schoolActivities" className="block font-bold mb-2">
            Involvement in School Activities
          </label>
          <textarea
            id="schoolActivities"
            name="schoolActivities"
            value={formData.schoolActivities}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="feedback" className="block font-bold mb-2">
            Feedback or Communication with School
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
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

export default ParentRegistration;
