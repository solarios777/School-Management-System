"use client";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchStudentResults,
  fetchStudentRank,
} from "@/app/_services/GlobalApi"; // Import API for rank fetching
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ResultsTable from "@/components/resultComponents/resultsTable";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import html2canvas from "html2canvas";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Result {
  id: string;
  marks: number;
  examType: string;
  semester: number;
  year: string;
  subject: { name: string };
}

interface RankData {
  rank: number;
  semester: string;
  year: string;
}

export default function SingleStudentResult({
  searchParams,
}: {
  searchParams: { studentId?: string };
}) {
  const [results, setResults] = useState<Result[]>([]);
  const [grade, setGrade] = useState<string | null>(null);
  const [section, setSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ranks, setRanks] = useState<Record<string, number | null>>({}); // Store ranks by "year-semester" key
  const printRef = useRef<HTMLDivElement>(null);
  const [students, setStudents] = useState([]);
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("1");
  const [studentName, setStudentName]=useState<string>("")

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchParams.studentId) return;
      try {
        const data = await fetchStudentResults(searchParams.studentId);
        setResults(data.results);
        setGrade(data.grade);
        setSection(data.section);
        setStudentName(data)


        // Fetch ranks for each semester-year combination
        const rankPromises = data.results.map(async (result: Result) => {
          const key = `${result.year}-${result.semester}`;
          if (!ranks[key]) {
            // Avoid duplicate requests
            const rankData = await fetchStudentRank(
              searchParams.studentId!,
              result.semester,
              result.year
            );
            return { key, rank: rankData.rank };
          }
          return null;
        });

        const resolvedRanks = await Promise.all(rankPromises);
        const newRanks: Record<string, number | null> = {};
        resolvedRanks.forEach((item) => {
          if (item) newRanks[item.key] = item.rank;
        });

        setRanks(newRanks);
      } catch (error) {
        console.error("Failed to fetch results or ranks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams.studentId]);
  console.log(studentName);
  

  const groupedResults = results.reduce((acc: Record<string, any>, result) => {
    const key = `${result.year}-${result.semester}`;
    if (!acc[key]) {
      acc[key] = {
        year: result.year,
        semester: result.semester,
        subjects: {},
        totalMarks: 0,
      };
    }
    const subjectKey = result.subject.name;
    if (!acc[key].subjects[subjectKey]) {
      acc[key].subjects[subjectKey] = {
        subject: result.subject.name,
        totalMarks: 0,
        assessments: [],
      };
    }
    acc[key].subjects[subjectKey].totalMarks += result.marks;
    acc[key].subjects[subjectKey].assessments.push(result);
    acc[key].totalMarks += result.marks;
    return acc;
  }, {});

  const sortedSemesters = Object.values(groupedResults).sort(
    (a: any, b: any) => {
      const [aStart] = a.year.split("/").map(Number);
      const [bStart] = b.year.split("/").map(Number);
      if (bStart !== aStart) return bStart - aStart;
      return b.semester - a.semester;
    }
  );

  const selectedData = sortedSemesters.find(
    (item: any) =>
      item.year === selectedYear &&
      item.semester.toString() === selectedSemester
  );

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
    // fetchLatestRelease();
  }, []);

  useEffect(() => {
    if (selectedYear && selectedSemester) {
      // fetchResults(selectedYear, selectedSemester);
    }
  }, [selectedYear, selectedSemester]);

  // Download PDF functionality
  
  // const printRef = useRef(null);

  const handleDownloadPDF = () => {
    if (!printRef.current) return;

    html2canvas(printRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Adjust size to fit in A4 page
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Result_${selectedData.year}_${selectedData.semester}.pdf`);
    });}
    
    
  
  return (
    <>
      <div>
        <Card className="mb-6 max-w-[400px]">
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Academic Year */}
            <Select
              value={selectedYear}
              onValueChange={(val) => setSelectedYear(val)}
            >
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
            <Select
              value={selectedSemester}
              onValueChange={(val) => setSelectedSemester(val)}
            >
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

     
<div className="flex gap-4 mt-4">
        <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-500 text-white rounded">
          Download PDF
        </button>
      </div>
        {/* Print and Download Buttons */}
        <div>
      

      <div ref={printRef} className="p-5 border border-gray-300 rounded-md bg-white shadow-md">
        {selectedData ? (
          <div>
            <div className="justify-center">
               <Image src="/android-chrome-512x512.png" alt="" width={100} height={100} />
            </div>
            
            {/* Header Section */}
            <div className="bg-blue-300 p-3 rounded-md font-semibold text-lg flex gap-2">
              <div className="font-bold">Year: {selectedData.year}</div>
              <div className="font-bold">Sem: {selectedData.semester}</div>
              <div className="font-bold">Grade: {grade} {section}</div>
            </div>

            {/* Results Table */}
            <div className="border border-green-50 bg-green-50 p-3 rounded-md mt-2">
              <table className="w-full border-collapse border border-gray-100">
                <thead>
                  <tr className="bg-green-100 text-black">
                    <th className="border border-gray-300 p-2">No.</th>
                    <th className="border border-gray-300 p-2">Subject Name</th>
                    <th className="border border-gray-300 p-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(selectedData.subjects).map((subject: any, index) => (
                    <tr key={subject.subject} className="text-center bg-white even:bg-gray-100 hover:bg-gray-200">
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{subject.subject}</td>
                      <td className="border border-gray-300 p-2 text-red-600 font-bold">{subject.totalMarks}</td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary Section */}
              <div className="mt-4 font-bold flex flex-col md:flex-row gap-4">
                <p>Total: <span className="text-red-600">{selectedData.totalMarks}</span></p>
                <p>Average: <span className="text-red-600">{(selectedData.totalMarks / Object.keys(selectedData.subjects).length).toFixed(2)}</span></p>
                <p>Rank: <span className="text-red-600">{ranks[`${selectedData.year}-${selectedData.semester}`] ?? "N/A"}</span></p>
              </div>
            </div>
          </div>
        ) : (
         ""
        )}
      </div>
    </div>
      </div>
      <div className="p-5">
        <h1 className="text-xl font-bold mb-4">My Grade Report</h1>
        {loading ? (
          <p>Loading...</p>
        ) : sortedSemesters.length === 0 ? (
          <p>No results found</p>
        ) : (
          sortedSemesters.map((group: any) => {
            const subjectCount = Object.keys(group.subjects).length;
            const averageMarks =
              subjectCount > 0
                ? (group.totalMarks / subjectCount).toFixed(2)
                : "0";
            const rankKey = `${group.year}-${group.semester}`;
            const studentRank = ranks[rankKey] ?? "N/A"; // Get rank from state

            return (
              <div
                key={`${group.year}-${group.semester}`}
                className="border border-gray-100 p-5 rounded-md overflow-x-scroll shadow-md mb-6"
              >
                <div className="bg-blue-300 p-3 rounded-md gx-4 font-semibold text-sm lg:text-lg flex gap-2">
                  <div className="font-bold">Year: {group.year}</div>{" "}
                  <div className="font-bold">Sem: {group.semester}</div>{" "}
                  <div className="font-bold">
                    Grade: {grade}
                    {section}
                  </div>
                </div>
                <div className="border border-green-50 bg-green-50 p-3 rounded-md mt-2">
                  <table className="w-full border-collapse border border-gray-100">
                    <thead>
                      <tr className="bg-green-100 text-black">
                        <th className="border border-gray-300 p-2">No.</th>
                        <th className="border border-gray-300 p-2">
                          Subject Name
                        </th>
                        <th className="border border-gray-300 p-2">Total</th>
                        <th className="border border-gray-300 p-2">
                          Assessment
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(group.subjects).map(
                        (subject: any, index) => (
                          <tr
                            key={subject.subject}
                            className="text-center bg-white even:bg-gray-100 hover:bg-gray-200"
                          >
                            <td className="border border-gray-300 p-2">
                              {index + 1}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {subject.subject}
                            </td>
                            <td className="border border-gray-300 p-2 text-red-600 font-bold">
                              {subject.totalMarks}
                            </td>
                            <td className="border border-gray-300 p-2">
                              <Dialog>
                                <DialogTrigger className="px-3 py-1 border border-gray-400 rounded-md">
                                  Assessment
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="text-lg font-bold">
                                      Assessment Result
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="p-3 border border-gray-300 rounded-md">
                                    <h2 className="text-blue-600 font-semibold mb-2">
                                      {subject.subject}
                                    </h2>
                                    <table className="w-full border-collapse border border-gray-300">
                                      <thead>
                                        <tr className="bg-green-300">
                                          <th className="border border-gray-300 p-2">
                                            S.No.
                                          </th>
                                          <th className="border border-gray-300 p-2">
                                            Assessment
                                          </th>
                                          <th className="border border-gray-300 p-2">
                                            Result
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {subject.assessments.map(
                                          (assessment: any, idx: number) => (
                                            <tr
                                              key={assessment.id}
                                              className="text-center bg-white hover:bg-gray-100"
                                            >
                                              <td className="border border-gray-300 p-2">
                                                {idx + 1}
                                              </td>
                                              <td className="border border-gray-300 p-2">
                                                {assessment.examType}
                                              </td>
                                              <td className="border border-gray-300 p-2">
                                                {assessment.marks}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  <div className="mt-4 font-bold flex flex-col md:flex-row gap-4">
                    <p>
                      Total:{" "}
                      <span className="text-red-600">{group.totalMarks}</span>
                    </p>
                    <p>
                      Average:{" "}
                      <span className="text-red-600">{averageMarks}</span>
                    </p>
                    <p>
                      Rank: <span className="text-red-600">{studentRank}</span>
                    </p>{" "}
                    {/* Display Rank */}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
  }
