"use client";

import { useState, useEffect } from "react";
import { Table } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchPeriodTimetable } from "@/app/_services/scheduleRelated";
import { fetchGradeClasses } from "@/app/_services/scheduleRelated";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface PeriodRow {
  id: string;
  rollNo: number | null;
  startTime: string;
  endTime: string;
  type: string;
}

interface GradeClass {
  id: string;
  grade: string | number;
  className: string;
}

export default function ScheduleTables() {
  const [gradeClasses, setGradeClasses] = useState<GradeClass[]>([]);
  const [filteredGradeClasses, setFilteredGradeClasses] = useState<GradeClass[]>([]);
  const [rows, setRows] = useState<{ [key: string]: PeriodRow[] }>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const gradeClassData = await fetchGradeClasses();
        
        // Sort grade classes by grade and className
        gradeClassData.sort((a: GradeClass, b: GradeClass) => {
          if (a.grade === b.grade) {
            return a.className.localeCompare(b.className);
          }
          return parseInt(a.grade.toString()) - parseInt(b.grade.toString());
        });
        
        setGradeClasses(gradeClassData);
        setFilteredGradeClasses(gradeClassData);

        const timetableData = await fetchPeriodTimetable();
        let rollNoCounter = 1;
        const formattedData = timetableData.map((row: any) => {
          const isBreak = row.type === "BREAK";
          return {
            id: row.id,
            rollNo: isBreak ? null : rollNoCounter++,
            startTime:isBreak ? null : row.startTime,
            endTime: isBreak ? null :row.endTime,
            type: row.type,
          };
        });

        const tableData: { [key: string]: PeriodRow[] } = {};
        gradeClassData.forEach((gc: GradeClass) => {
          tableData[gc.id] = formattedData;
        });

        setRows(tableData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredGradeClasses(gradeClasses);
    } else {
      setFilteredGradeClasses(
        gradeClasses.filter((gc) => gc.grade.toString().includes(search))
      );
    }
  }, [search, gradeClasses]);

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Filter by grade (e.g., 9, 10, 11)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      {filteredGradeClasses.map((gc) => (
        <Card key={gc.id} className="p-4 shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            Schedule for {gc.grade} {gc.className}
          </h2>
          <div className="overflow-x-auto">
            <Table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Roll No.</th>
                  <th className="p-2 border">Time</th>
                  {days.map((day) => (
                    <th key={day} className="p-2 border">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">Loading...</td>
                  </tr>
                ) : (
                  rows[gc.id]?.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b ${row.type === "BREAK" ? "bg-yellow-200 font-semibold" : ""}`}
                    >
                      <td className="p-2 border text-center">
                        {row.rollNo !== null ? row.rollNo : "—"}
                      </td>
                      <td className="p-2 border">{row.startTime} - {row.endTime}</td>
                      {days.map((day) => (
                        <td key={`${row.id}-${day}`} className="p-2 border"></td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      ))}
      <Button onClick={() => window.location.reload()} className="mt-4">Refresh</Button>
    </div>
  );
}
