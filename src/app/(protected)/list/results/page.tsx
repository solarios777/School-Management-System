"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchStudentResults } from "@/app/_services/GlobalApi";

interface Result {
  id: string;
  marks: number;
  examType: string;
  semester: number;
  year: string;
  subject: { name: string };
}

export default function SingleStudentResult({ searchParams }: { searchParams: { studentId?: string } }) {
  const [results, setResults] = useState<Result[]>([]);
  const [grade, setGrade] = useState<string | null>(null);
  const [section, setSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchParams.studentId) return;
      try {
        const data = await fetchStudentResults(searchParams.studentId);
        setResults(data.results);
        setGrade(data.grade);
        setSection(data.section);
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams.studentId]);

  const groupedResults = results.reduce((acc: Record<string, any>, result) => {
    const key = `${result.year}-${result.semester}`;
    if (!acc[key]) {
      acc[key] = { year: result.year, semester: result.semester, subjects: {}, totalMarks: 0 };
    }
    const subjectKey = result.subject.name;
    if (!acc[key].subjects[subjectKey]) {
      acc[key].subjects[subjectKey] = { subject: result.subject.name, totalMarks: 0, assessments: [] };
    }
    acc[key].subjects[subjectKey].totalMarks += result.marks;
    acc[key].subjects[subjectKey].assessments.push(result);
    acc[key].totalMarks += result.marks;
    return acc;
  }, {});

  const sortedSemesters = Object.values(groupedResults).sort((a: any, b: any) => {
    const [aStart] = a.year.split("/").map(Number);
    const [bStart] = b.year.split("/").map(Number);
    if (bStart !== aStart) return bStart - aStart;
    return b.semester - a.semester;
  });

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">My Grade Report</h1>
      {loading ? (
        <p>Loading...</p>
      ) : sortedSemesters.length === 0 ? (
        <p>No results found</p>
      ) : (
        sortedSemesters.map((group: any) => {
          const subjectCount = Object.keys(group.subjects).length;
          const averageMarks = subjectCount > 0 ? (group.totalMarks / subjectCount).toFixed(2) : "0";

          return (
            <div key={`${group.year}-${group.semester}`} className="border border-gray-100 p-5 rounded-md overflow-x-scroll shadow-md mb-6">
              <div className="bg-blue-300 p-3 rounded-md gx-4 font-semibold text-sm lg:text-lg flex gap-2">
                <div className="font-bold">Year: {group.year}</div>  {" "}
                <div className="font-bold">Sem: {group.semester}</div>  {" "}
                <div className="font-bold">Grade: {grade}{section}</div>
              </div>
              <div className="border border-green-50 bg-green-50 p-3 rounded-md mt-2">
                <table className="w-full border-collapse border border-gray-100">
                  <thead>
                    <tr className="bg-green-100 text-black">
                      <th className="border border-gray-300 p-2">No.</th>
                      <th className="border border-gray-300 p-2">Subject Name</th>
                      <th className="border border-gray-300 p-2">Total</th>
                      <th className="border border-gray-300 p-2">Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(group.subjects).map((subject: any, index) => (
                      <tr key={subject.subject} className="text-center bg-white even:bg-gray-100 hover:bg-gray-200">
                        <td className="border border-gray-300 p-2">{index + 1}</td>
                        <td className="border border-gray-300 p-2">{subject.subject}</td>
                        <td className="border border-gray-300 p-2 text-red-600 font-bold">{subject.totalMarks}</td>
                        <td className="border border-gray-300 p-2">
                          <Dialog>
                            <DialogTrigger className="px-3 py-1 border border-gray-400 rounded-md">Assessment</DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-lg font-bold">Assessment Result</DialogTitle>
                              </DialogHeader>
                              <div className="p-3 border border-gray-300 rounded-md">
                                <h2 className="text-blue-600 font-semibold mb-2">{subject.subject}</h2>
                                <table className="w-full border-collapse border border-gray-300">
                                  <thead>
                                    <tr className="bg-green-300">
                                      <th className="border border-gray-300 p-2">S.No.</th>
                                      <th className="border border-gray-300 p-2">Assessment</th>
                                      <th className="border border-gray-300 p-2">Result</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {subject.assessments.map((assessment: any, idx: number) => (
                                      <tr key={assessment.id} className="text-center bg-white hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2">{idx + 1}</td>
                                        <td className="border border-gray-300 p-2">{assessment.examType}</td>
                                        <td className="border border-gray-300 p-2">{assessment.marks}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <p className="mt-2 font-bold">Total Mark: {subject.totalMarks} / 100</p>
                                </table>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 font-bold">
                  <p>Total:<span className="text-red-600"> {group.totalMarks}</span></p>
                  <p>Average: <span className="text-red-600">{averageMarks}</span></p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
