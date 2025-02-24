"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import ResultsTable from "./resultsTable";
import { fetchAllResults } from "@/app/_services/GlobalApi";
import axiosInstance from "@/app/_services/GlobalApi";

interface ResultRelease {
  year: string;
  semester: number;
}

const SingleSectionResult: React.FC<{ gradeId: string; classId?: string }> = ({ gradeId, classId }) => {
  const [students, setStudents] = useState([]);
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the most recent released year and semester
  const fetchLatestRelease = async () => {
    try {
      const response = await axiosInstance.get("/results/resultReleased");
      const latest: ResultRelease = response.data;

      if (latest) {
        setSelectedYear(latest.year);
        setSelectedSemester(latest.semester.toString());
        fetchResults(latest.year, latest.semester.toString());
      }
    } catch (error) {
      console.error("Error fetching latest release:", error);
    }
  };

  // Fetch student results based on selected year and semester
  const fetchResults = async (year: string, semester: string) => {
    setLoading(true);
    try {
      const data = await fetchAllResults(year, semester, gradeId, classId);
      setStudents(data.students);
    } catch (error) {
      setStudents([]);
    }
    setLoading(false);
  };

  // Generate available academic years
  useEffect(() => {
    const generateAcademicYears = () => {
      const currentYear = new Date().getFullYear();
      const startYear = new Date().getMonth() + 1 < 9 ? currentYear - 1 : currentYear;
      return Array.from({ length: 5 }, (_, i) => `${startYear + i - 2}/${(startYear + i - 1) % 100}`);
    };
    setAcademicYears(generateAcademicYears());
    fetchLatestRelease();
  }, []);

  useEffect(() => {
    if (selectedYear && selectedSemester) {
      fetchResults(selectedYear, selectedSemester);
    }
  }, [selectedYear, selectedSemester]);

  return (
    <div className="p-4 bg-white rounded-md">
      <h2 className="text-lg font-semibold mb-4">Student Results</h2>

      <Card className="mb-6 max-w-[400px]">
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Academic Year */}
          <Select value={selectedYear} onValueChange={(val) => setSelectedYear(val)}>
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
          <Select value={selectedSemester} onValueChange={(val) => setSelectedSemester(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Sem-I</SelectItem>
              <SelectItem value="2">Sem-II</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-center text-gray-500">Loading results...</p>
      ) : students.length > 0 ? (
        <ResultsTable students={students} />
      ) : (
        <p className="text-center text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default SingleSectionResult;
