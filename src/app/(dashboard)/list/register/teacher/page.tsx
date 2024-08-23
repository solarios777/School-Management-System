"use client";

import React, { useState } from "react";

interface TeacherRegistrationFormData {
  school: string;
  schoolType: "primary" | "high_school";
  subjectsTaught: string[];
  name: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  contactInfo: string;
  educationQualifications: string;
  teachingExperience: string;
  subjectsQualifiedTo: string[];
  subjectsCurrentlyTeaching: string[];
  classesAssigned: string[];
  attendanceRecords: string;
  professionalDevelopment: string;
  performanceEvaluations: string;
}

const TeacherRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<TeacherRegistrationFormData>({
    school: "",
    schoolType: "primary",
    subjectsTaught: [],
    name: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    contactInfo: "",
    educationQualifications: "",
    teachingExperience: "",
    subjectsQualifiedTo: [],
    subjectsCurrentlyTeaching: [],
    classesAssigned: [],
    attendanceRecords: "",
    professionalDevelopment: "",
    performanceEvaluations: "",
  });

  const handleChange = (
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
    <div className="bg-white p-6 md:p-10 rounded-lg mx-[5%] lg:mx-[10%] xl:mx-[15%] shadow-md">
      <h2 className="text-2xl font-bold mb-4">Teacher Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label htmlFor="schoolType" className="block font-medium mb-2">
            School Type <span className="text-red-500">*</span>
          </label>
          <select
            id="schoolType"
            name="schoolType"
            value={formData.schoolType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          >
            <option value="primary">Primary</option>
            <option value="high_school">High School</option>
          </select>
        </div>
        <div>
          <label htmlFor="subjectsTaught" className="block font-medium mb-2">
            Subjects Taught <span className="text-red-500">*</span>
          </label>
          <textarea
            id="subjectsTaught"
            name="subjectsTaught"
            value={formData.subjectsTaught.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                subjectsTaught: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Teacher Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block font-medium mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="gender" className="block font-medium mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block font-medium mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="contactInfo" className="block font-medium mb-2">
            Contact Information <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="educationQualifications"
            className="block font-medium mb-2"
          >
            Education Qualifications <span className="text-red-500">*</span>
          </label>
          <textarea
            id="educationQualifications"
            name="educationQualifications"
            value={formData.educationQualifications}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="teachingExperience"
            className="block font-medium mb-2"
          >
            Teaching Experience <span className="text-red-500">*</span>
          </label>
          <textarea
            id="teachingExperience"
            name="teachingExperience"
            value={formData.teachingExperience}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="subjectsQualifiedTo"
            className="block font-medium mb-2"
          >
            Subjects Qualified to Teach <span className="text-red-500">*</span>
          </label>
          <textarea
            id="subjectsQualifiedTo"
            name="subjectsQualifiedTo"
            value={formData.subjectsQualifiedTo.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                subjectsQualifiedTo: e.target.value
                  .split(",")
                  .map((s) => s.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="subjectsCurrentlyTeaching"
            className="block font-medium mb-2"
          >
            Subjects Currently Teaching <span className="text-red-500">*</span>
          </label>
          <textarea
            id="subjectsCurrentlyTeaching"
            name="subjectsCurrentlyTeaching"
            value={formData.subjectsCurrentlyTeaching.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                subjectsCurrentlyTeaching: e.target.value
                  .split(",")
                  .map((s) => s.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="classesAssigned" className="block font-medium mb-2">
            Classes/Sections Assigned <span className="text-red-500">*</span>
          </label>
          <textarea
            id="classesAssigned"
            name="classesAssigned"
            value={formData.classesAssigned.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                classesAssigned: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="attendanceRecords" className="block font-medium mb-2">
            Attendance Records <span className="text-red-500">*</span>
          </label>
          <textarea
            id="attendanceRecords"
            name="attendanceRecords"
            value={formData.attendanceRecords}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="professionalDevelopment"
            className="block font-medium mb-2"
          >
            Professional Development <span className="text-red-500">*</span>
          </label>
          <textarea
            id="professionalDevelopment"
            name="professionalDevelopment"
            value={formData.professionalDevelopment}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="performanceEvaluations"
            className="block font-medium mb-2"
          >
            Performance Evaluations <span className="text-red-500">*</span>
          </label>
          <textarea
            id="performanceEvaluations"
            name="performanceEvaluations"
            value={formData.performanceEvaluations}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-lamaPurple focus:ring-lamaPurple p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-lamaPurple text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-lamaPurple focus:ring-opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TeacherRegistrationForm;
