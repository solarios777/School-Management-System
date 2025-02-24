"use client";

import React, { useState, useEffect } from "react";
import { fetchAllResults } from "@/app/_services/GlobalApi";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import ResultsTable from "./resultsTable";

interface Grade {
  id: string;
  level: number;
}
interface Class {
  id: string;
  name: string;
}
interface Student {
  id: string;
  name: string;
  results: any[];
}
interface SelectionClientProps {
  grades: Grade[];
  classes: Class[];
}

const ViewResults: React.FC<SelectionClientProps> = ({ grades, classes }) => {
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState<string>(currentYear);
  const [semester, setSemester] = useState<string>("1");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [academicYears, setAcademicYears] = useState<string[]>([]);

  // Fetch results whenever grade, semester, or year changes
  useEffect(() => {
    const fetchAndSetResults = async () => {
      if (!year || !semester || !selectedGrade) return;

      try {
        const data = await fetchAllResults(year, semester, selectedGrade, selectedClass);
        console.log("Fetched Data:", data);
        setStudents(data.students);
      } catch (error) {
        console.error("Error fetching results:", error);
        setStudents([]);
      }
    };

    fetchAndSetResults();
  }, [year, semester, selectedGrade, selectedClass]);

  // Generate academic years dynamically
  useEffect(() => {
    const generateAcademicYears = () => {
      const currentYear = new Date().getFullYear();
      const startYear = new Date().getMonth() + 1 < 9 ? currentYear - 1 : currentYear;
      return Array.from({ length: 5 }, (_, i) => `${startYear + i - 2}/${(startYear + i - 1) % 100}`);
    };
    setAcademicYears(generateAcademicYears());
  }, []);
  const sortedGrades = [...grades].sort((a, b) => a.level - b.level);
  const sortedClasses = [...classes].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <>
      <div className="p-6 max-w-full md:max-w-3xl mx-auto">
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
                {sortedGrades.map((grade) => (
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
                {sortedClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

           
            
          </CardContent>
        </Card>

        

     

      </div>
         {students.length > 0 ? (
  <ResultsTable students={students} />
) : (
  <p className="text-center text-gray-500">No results found.</p>
)}
    </>
  );
};

export default ViewResults;
