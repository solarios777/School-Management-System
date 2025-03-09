"use client";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  fetchStudentResults,
  fetchStudentRank,
} from "@/app/_services/GlobalApi"; // Import API for rank fetching
import jsPDF from "jspdf";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import html2canvas from "html2canvas";
import { motion } from "framer-motion"; // Animation library
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { set } from "date-fns";
import { DialogDescription } from "@radix-ui/react-dialog";

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
  const [studentUserName, setStudentUserName]=useState<string>("")
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);


 useEffect(() => {
  const fetchResults = async () => {
    if (!searchParams.studentId) return;
    try {
      const data = await fetchStudentResults(searchParams.studentId);
      setResults(data.results);
      setGrade(data.grade);
      setSection(data.section);
      setStudentName(`${data.name} ${data.surname}`);
      setStudentUserName(data.username);

      // Fetch ranks for each unique semester-year combination
      const uniqueSemesters = Array.from(
        new Set(data.results.map((result: Result) => `${result.year}-${result.semester}`)
      ));

      const rankPromises = uniqueSemesters.map(async (key: any) => {
        const [year, semester] = key.split("-");
        try {
          const rankData = await fetchStudentRank(
            searchParams.studentId!,
            parseInt(semester),
            year
          );
          return { key, rank: rankData.rank };
        } catch (error) {
          console.error(`Failed to fetch rank for ${key}`, error);
          return { key, rank: null }; // If rank fetch fails, store null for that semester
        }
      });

      const resolvedRanks = await Promise.all(rankPromises);
      const newRanks: Record<string, number | null> = {};
      resolvedRanks.forEach((item: { key: string; rank: number | null }) => {
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

  const handleHighDownloadPDF = () => {
    if (!printRef.current) return;

    html2canvas(printRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Adjust size to fit in A4 page
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Result_${selectedData.year}_${selectedData.semester}.pdf`);
    })
    setIsDialogOpen(false)
    ;}

     useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
    
  const handleNormalDownloadPDF = () => {
  if (!printRef.current) return;

  html2canvas(printRef.current, { scale: 1.5, useCORS: true }).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg", 0.7); // Convert to JPEG with 70% quality
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    pdf.addImage(imgData, "JPEG", 0, 10, imgWidth, imgHeight); // Position below header
    pdf.save(`Result_${selectedData.year}_${selectedData.semester}.pdf`);
  });
  setIsDialogOpen(false)
};
    
  
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

     
{/* Download Button that opens the dialog */}
       <Button
        onClick={() => setIsDialogOpen(true)}
        className="px-6 py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
      >
        Download PDF
      </Button>

      {/* Animated Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          
          className="rounded-xl shadow-2xl border border-gray-200 bg-white p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Dialog Title with Gradient Text */}
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text text-center">
              Download Student Result
            </DialogTitle>

            {/* Description */}
            <DialogDescription className="text-gray-600 text-center mt-2">
              Choose the quality of the PDF you want to download.
            </DialogDescription>

            {/* Button Options */}
            <DialogFooter className="flex justify-center gap-6 mt-6">
              <Button
                variant="outline"
                onClick={handleNormalDownloadPDF}
                className="px-5 py-2 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300"
              >
                Normal Quality
              </Button>
              <Button
                onClick={handleHighDownloadPDF}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                High Quality
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
        {/* Print and Download Buttons */}
        <div>
      

      <div ref={printRef} className="p-5 border border-gray-300 rounded-md bg-white shadow-md">
  {selectedData ? (
    <div className="text-center">
      {/* Official Header */}
      <h1 className="text-2xl font-extrabold uppercase">Official Student Result Card</h1>
      <p className="text-gray-600">Academic Performance Report</p>

      {/* Centered Logo */}
      <div className="flex justify-center items-center my-4">
        <Image src="/mcslogo.jpg" alt="School Logo" width={120} height={120} />
      </div>

      {/* Student Information */}
      <div className="mt-3 text-lg font-semibold">
        <p>Student Name: <span className="font-bold">{studentName} </span></p>
        <p>Username: <span className="font-bold">{studentUserName}</span></p>
      </div>

      {/* Header Section */}
      <div className="bg-blue-300 p-3 rounded-md font-semibold text-lg flex justify-center gap-5 mt-4">
        <div className="font-bold">Year: {selectedData.year}</div>
        <div className="font-bold">Semester: {selectedData.semester}</div>
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
        <div className="mt-4 font-bold text-lg">
          <p>Total: <span className="text-red-600">{selectedData.totalMarks}</span></p>
          <p>Average: <span className="text-red-600">{(selectedData.totalMarks / Object.keys(selectedData.subjects).length).toFixed(2)}</span></p>
          <p>Rank: <span className="text-red-600">{ranks[`${selectedData.year}-${selectedData.semester}`] ?? "N/A"}</span></p>
        </div>

        {/* Official Closing Note */}
        <div className="mt-6 text-sm text-gray-600 italic border-t pt-3">
          <p>This result is an official document of the institution and should be treated as such.</p>
          <p>For any discrepancies, please contact the administration.</p>
        </div>
        {/* Footer - Copyright Notice */}
          <div className="text-center text-gray-500 text-sm mt-6">
            <p>© {currentYear} Meki Catholic School. All Rights Reserved.</p>
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
