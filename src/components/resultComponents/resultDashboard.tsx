"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  deleteAssessment,
  fetchStudents,
  submitNormalResults,
  submitUploadedResults,
} from "@/app/_services/GlobalApi";
import ResultAGGrid from "@/components/resultComponents/resultAGgrid";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import axios from "axios";
import { set } from "date-fns";

interface Grade {
  id: string;
  level: number;
}
interface Class {
  id: string;
  name: string;
}
interface Subject {
  id: string;
  name: string;
}
interface Student {
  id: string;
  name: string;
  username: string;
  grade: string;
  section: string;
  rollNumber: string;
  [key: string]: any; // Allow dynamic assessment fields
}

interface ResultDashboardProps {
  grades: Grade[];
  classes: Class[];
  subjects: Subject[];
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({
  grades,
  classes,
  subjects,
}) => {
  const [year, setYear] = useState<string>("");
  const [uploadedyear, setUploadedYear] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [uploadedsemester, setUploadedSemester] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [uploadedselectedGrade, setUploadedSelectedGrade] =
    useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [uploadedselectedClass, setUploadedSelectedClass] =
    useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [uploadedsubject, setUploadedSubject] = useState<string>("");
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assessmentTypes, setAssessmentTypes] = useState<string[]>([]);
  const [newAssessment, setNewAssessment] = useState<string>("");
  const [dataSource, setDataSource] = useState<"api" | "file" | null>(null);
  const [noStudentsFound, setNoStudentsFound] = useState<boolean>(false);
  const [isuploadSelectionModalOpen, setIsuploadSelectionModalOpen] =
    useState<boolean>(false);
  const [isnormalSelectionModalOpen, setIsnormalSelectionModalOpen] =
    useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
const [deleteTimeout, setDeleteTimeout] = useState<NodeJS.Timeout | null>(null);
const [isDeleting, setIsDeleting] = useState(false);
  const [ isDeleteModalOpen,setIsDeleteModalOpen]= useState<boolean>(false);

const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const generateAcademicYears = () => {
      const currentYear = new Date().getFullYear();
      const startYear =
        new Date().getMonth() + 1 < 9 ? currentYear - 1 : currentYear;
      return Array.from(
        { length: 5 },
        (_, i) => `${startYear + i - 2}/${(startYear + i - 1) % 100}`
      );
    };
    setAcademicYears(generateAcademicYears());
  }, []);

  const loadStudents = async () => {
    if (!year || !semester || !selectedGrade || !selectedClass || !subject) {
      alert("Please select all fields before loading students.");
      return;
    }

    try {
      const studentsData = await fetchStudents(
        year,
        semester,
        selectedGrade,
        selectedClass,
        subject
      );

      if (studentsData.length === 0) {
        setNoStudentsFound(true);
        setStudents([]);
        setAssessmentTypes([]);
        return;
      }

      setNoStudentsFound(false);
      setStudents(studentsData);

      // Extract assessment types dynamically (excluding standard student fields)
      const dynamicAssessments = Object.keys(studentsData[0]).filter(
        (key) =>
          ![
            "id",
            "name",
            "username",
            "grade",
            "email",
            "surname",
            "section",
            "rollNumber",
          ].includes(key) && key !== "result" // Explicitly remove unwanted "result"
      );

      setAssessmentTypes(
        dynamicAssessments.length > 0 ? dynamicAssessments : []
      );
      setDataSource("api");
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  const handleAddAssessment = () => {
    if (newAssessment.trim() && !assessmentTypes.includes(newAssessment)) {
      setAssessmentTypes([...assessmentTypes, newAssessment]);
      setNewAssessment("");
    }
  };

  const exportToCSV = () => {
    if (students.length === 0) return;

    const dataToExport = students.map((student) => {
      const studentData: any = {
        name: student.name,
        username: student.username,
        rollNumber: student.rollNumber,
      };
      assessmentTypes.forEach((assessment) => {
        studentData[assessment] = student[assessment] || ""; // Include assessments in export
      });
      return studentData;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students_data.xlsx");
  };

  const importFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<Student>(worksheet);

      if (jsonData.length > 0) {
        setStudents(jsonData);
        setDataSource("file");

        const newAssessmentFields = Object.keys(jsonData[0]).filter(
          (key) => !["id", "name", "username", "rollNumber"].includes(key)
        );
        setAssessmentTypes(newAssessmentFields);
      }
    };
    reader.readAsArrayBuffer(file);
  };
 




const handleDeleteAssessment = async () => {
  const selectedAssessment = (
    document.getElementById("assessmentSelect") as HTMLSelectElement
  )?.value;

  if (!selectedAssessment) {
    alert("Please select an assessment to delete.");
    return;
  }

  setPendingDelete(selectedAssessment);
  setCountdown(5); // Start countdown from 10 seconds

  const interval = setInterval(() => {
    setCountdown((prev) => (prev !== null ? prev - 1 : null));
  }, 1000); // Decrement every second

  const timeout = setTimeout(() => {
    clearInterval(interval);
    confirmDelete(selectedAssessment);
  }, 5000); // 10 seconds delay before actual deletion

  setDeleteTimeout(timeout);
};

const undoDelete = () => {
  if (deleteTimeout) {
    clearTimeout(deleteTimeout);
  }
  setPendingDelete(null);
  setCountdown(null);
  setIsDeleteModalOpen(false);
};

const confirmDelete = async (assessment: string) => {
  setPendingDelete(null);
  setCountdown(null);
  setIsDeleting(true);

  if (dataSource === "api") {
    try {
      const response = await deleteAssessment(
        year,
        semester,
        selectedGrade,
        selectedClass,
        subject,
        assessment
      );

      if (response.success) {
        setStudents((prevStudents) =>
          prevStudents.map((student) => {
            const updatedStudent = { ...student };
            delete updatedStudent[assessment];
            return updatedStudent;
          })
        );
        setAssessmentTypes((prev) => prev.filter((a) => a !== assessment));
        alert(`Assessment "${assessment}" deleted successfully.`);
      } else {
        alert(`Failed to delete assessment: ${response.message}`);
      }
    } catch (error) {
      console.error("Failed to delete assessment:", error);
      alert("An error occurred while deleting the assessment.");
    }
  } else if (dataSource === "file") {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        const updatedStudent = { ...student };
        delete updatedStudent[assessment];
        return updatedStudent;
      })
    );
    setAssessmentTypes((prev) => prev.filter((a) => a !== assessment));
  } else {
    setAssessmentTypes((prev) => prev.filter((a) => a !== assessment));
    alert(`Assessment "${assessment}" removed.`);
  }

  setIsDeleting(false);
  setIsDeleteModalOpen(false);
};


  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handlesummitSelection = () => {
    if (dataSource === "api") {
      setIsnormalSelectionModalOpen(true);
    } else if (dataSource === "file") {
      setIsuploadSelectionModalOpen(true);
    }
  };
  const handlenormalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedData = students.map((student) => ({
        studentId: student.id,
        year,
        semester,
        gradeId: selectedGrade,
        classId: selectedClass,
        subjectId: subject,
        scores: assessmentTypes.map((assessment) => ({
          examType: assessment,
          marks: student[assessment] || 0,
        })),
      }));

      const response = await submitNormalResults(formattedData);

      alert("Results submitted successfully!");
    } catch (error) {
      alert("Failed to submit results");
    } finally {
      setIsSubmitting(false);
      setIsnormalSelectionModalOpen(false);
    }
  };

  const confirmuploadSelection = async () => {
    setIsSubmitting(true);
    try {
      const formattedData = students.map((student) => ({
        studentId: student.name,
        studentusername: student.username,
        year: uploadedyear,
        semester: uploadedsemester,
        gradeId: uploadedselectedGrade,
        classId: uploadedselectedClass,
        subjectId: uploadedsubject,
        scores: assessmentTypes.map((assessment) => ({
          assessmentType: assessment,
          score: student[assessment] || 0,
        })),
      }));

      console.log("Formatted Data:", formattedData);

      const response = await submitUploadedResults(formattedData);

      alert(
        `✅ Success: ${response.message || "Results submitted successfully!"}`
      );
    } catch (error: any) {
      // Extract the error message properly
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to submit results!";

      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      setIsuploadSelectionModalOpen(false);
    }
  };

  return (
    <>
      <div className="p-6 max-w-full md:max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Academic Year */}
            <Select onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Semester */}
            <Select onValueChange={setSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Sem-I</SelectItem>
                <SelectItem value="2">Sem-II</SelectItem>
              </SelectContent>
            </Select>

            {/* Grade */}
            <Select onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    Grade {grade.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Class */}
            <Select onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Subject */}
            <Select onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={loadStudents}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Load Students
            </Button>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={importFromFile}
            className="border p-2 rounded bg-white"
          />
          <Button
            onClick={exportToCSV}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Export to Excel
          </Button>
        </div>
      </div>
      {/* AG Grid & Assessments */}
      {noStudentsFound && (
        <div className="text-center text-red-600 font-semibold">
          No students found for the selected criteria.
        </div>
      )}

      {students.length > 0 && (
        <div className="mt-6">
          {dataSource === "api" && (
            <div className="text-xl font-bold mb-4">
              G-{grades.find((g) => g.id === selectedGrade)?.level}-
              {classes.find((c) => c.id === selectedClass)?.name},
              {subjects.find((s) => s.id === subject)?.name}
            </div>
          )}
          <div className="flex justify-between">
            <div>
              <input
                type="text"
                value={newAssessment}
                onChange={(e) => setNewAssessment(e.target.value)}
                placeholder="New Assessment"
                className="p-2 border rounded"
              />
              <Button onClick={handleAddAssessment}>Add Assessment</Button>
            </div>
            {/* Other UI elements remain unchanged */}
            {assessmentTypes.length > 0 && (
              <div>
                <select name="assessment" id="assessmentSelect">
                  {assessmentTypes.map((assessment) => (
                    <option key={assessment} value={assessment}>
                      {assessment}
                    </option>
                  ))}
                </select>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleOpenDeleteModal}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Assessment"}
                </Button>
              </div>
            )}

            <Button
              onClick={handlesummitSelection}
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Results"}
            </Button>
          </div>
          <ResultAGGrid students={students} assessmentTypes={assessmentTypes} />
        </div>
      )}
      {}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete this
        assessment and remove all data from our servers.
      </DialogDescription>
    </DialogHeader>
    <div className="flex justify-between items-center">
      {countdown !== null ? (
        <span className="text-red-500 font-bold">{countdown}s remaining...</span>
      ) : (
        <Button
          onClick={handleDeleteAssessment}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Delete
        </Button>
      )}
      {pendingDelete && (
        <Button onClick={undoDelete} className="ml-4 bg-gray-500 text-white">
          Undo
        </Button>
      )}
    </div>
  </DialogContent>
</Dialog>


      <Dialog
        open={isnormalSelectionModalOpen}
        onOpenChange={setIsnormalSelectionModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              Please make sure the data is correct. The following button will
              submit the results.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={handlenormalSubmit}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Confirm
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isuploadSelectionModalOpen}
        onOpenChange={setIsuploadSelectionModalOpen}
      >
        <DialogContent className="max-w-4xl w-full h-auto">
          <DialogHeader>
            <DialogTitle>Select Data Before Submitting</DialogTitle>
          </DialogHeader>
          <Card className="mb-6">
            <CardContent className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Academic Year */}
              <Select onValueChange={setUploadedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Semester */}
              <Select onValueChange={setUploadedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sem-I</SelectItem>
                  <SelectItem value="2">Sem-II</SelectItem>
                </SelectContent>
              </Select>

              {/* Grade */}
              <Select onValueChange={setUploadedSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      Grade {grade.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Class */}
              <Select onValueChange={setUploadedSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Subject */}
              <Select onValueChange={setUploadedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <DialogDescription>
            Please make sure the data is correct. The following button will
            submit the results.
          </DialogDescription>
          <Button
            onClick={confirmuploadSelection}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Confirm
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResultDashboard;
