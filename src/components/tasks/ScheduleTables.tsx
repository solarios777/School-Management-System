// components/ScheduleTables/ScheduleTables.tsx
"use client";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Table } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  fetchGradeClasses,
  fetchPeriodTimetable,
  fetchSubjectsandQuota,
} from "@/app/_services/scheduleRelated";
import { SubjectItem } from "./SubjectItem";
import { TimetableCell } from "./TimetableCell";
import {
  GradeClass,
  PeriodRow,
  SubjectQuota,
  TimetableCell as TimetableCellType,
} from "../../app/scheduleUtils/types";
import { sortGradeClasses } from "../../app/scheduleUtils/utils";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function ScheduleTables() {
  const [gradeClasses, setGradeClasses] = useState<GradeClass[]>([]);
  const [filteredGradeClasses, setFilteredGradeClasses] = useState<
    GradeClass[]
  >([]);
  const [rows, setRows] = useState<{ [key: string]: PeriodRow[] }>({});
  const [subjectsAndQuotas, setSubjectsAndQuotas] = useState<SubjectQuota[]>(
    []
  );
  const [timetable, setTimetable] = useState<TimetableCellType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch grade classes
        const gradeClassData = await fetchGradeClasses();
        const sortedGradeClasses = sortGradeClasses(gradeClassData);
        setGradeClasses(sortedGradeClasses);
        setFilteredGradeClasses(sortedGradeClasses);

        // Fetch timetable periods
        const timetableData = await fetchPeriodTimetable();
        let rollNoCounter = 1;
        const formattedData = timetableData.map((row: any) => {
          const isBreak = row.type === "BREAK";
          return {
            id: row.id,
            rollNo: isBreak ? null : rollNoCounter++,
            startTime: isBreak ? null : row.startTime,
            endTime: isBreak ? null : row.endTime,
            type: row.type,
          };
        });

        const tableData: { [key: string]: PeriodRow[] } = {};
        sortedGradeClasses.forEach((gc: GradeClass) => {
          tableData[gc.id] = formattedData;
        });
        setRows(tableData);

        // Fetch subjects and quotas
        const subjectsData = await fetchSubjectsandQuota();
        // Ensure each subject quota includes gradeClassId
        const formattedSubjectsData = subjectsData.map((sub: any) => ({
          ...sub,
          gradeClassId: sub.gradeClassId, // Add this field if not already present
        }));
        setSubjectsAndQuotas(formattedSubjectsData);

        // Initialize timetable cells
        const initialTimetable: TimetableCellType[] = [];
        sortedGradeClasses.forEach((gc: GradeClass) => {
          days.forEach((day) => {
            formattedData.forEach((period: PeriodRow) => {
              initialTimetable.push({
                day,
                periodId: period.id,
                subjectName: null,
                gradeClassId: gc.id,
              });
            });
          });
        });
        setTimetable(initialTimetable);
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

  const handleDrop = (
    subjectName: string,
    day: string,
    periodId: string,
    gradeClassId: string
  ) => {
    setTimetable((prev) =>
      prev.map((cell) => {
        if (
          cell.day === day &&
          cell.periodId === periodId &&
          cell.gradeClassId === gradeClassId
        ) {
          // If replacing a subject, increment its quota for the specific section
          if (cell.subjectName) {
            setSubjectsAndQuotas((prevQuotas) =>
              prevQuotas.map((sub) =>
                sub.subjectName === cell.subjectName &&
                sub.gradeClassId === gradeClassId
                  ? { ...sub, weeklyQuota: sub.weeklyQuota + 1 }
                  : sub
              )
            );
          }
          // Decrease the quota for the new subject for the specific section
          setSubjectsAndQuotas((prevQuotas) =>
            prevQuotas.map((sub) =>
              sub.subjectName === subjectName &&
              sub.gradeClassId === gradeClassId
                ? { ...sub, weeklyQuota: sub.weeklyQuota - 1 }
                : sub
            )
          );
          return { ...cell, subjectName };
        }
        return cell;
      })
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
            <div className="mb-4 p-4 bg-gray-100 rounded">
              <h3 className="text-lg font-semibold mb-2">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {subjectsAndQuotas
                  .filter(
                    (sub) => sub.gradeClassId === gc.id // Filter by gradeClassId
                  )
                  .map((sub) => (
                    <SubjectItem
                      key={sub.id}
                      subjectName={sub.subjectName}
                      weeklyQuota={sub.weeklyQuota}
                      disabled={sub.weeklyQuota === 0}
                    />
                  ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table className="w-full text-left border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Roll No.</th>
                    <th className="p-2 border">Time</th>
                    {days.map((day) => (
                      <th key={day} className="p-2 border">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    rows[gc.id]?.map((row) => (
                      <tr
                        key={row.id}
                        className={`border-b ${
                          row.type === "BREAK"
                            ? "bg-yellow-200 font-semibold"
                            : ""
                        }`}
                      >
                        <td className="p-2 border text-center">
                          {row.rollNo !== null ? row.rollNo : "—"}
                        </td>
                        <td className="p-2 border">
                          {row.startTime} - {row.endTime}
                        </td>
                        {days.map((day) => {
                          const cell = timetable.find(
                            (cell) =>
                              cell.day === day &&
                              cell.periodId === row.id &&
                              cell.gradeClassId === gc.id
                          );
                          return (
                            <TimetableCell
                              key={`${day}-${row.id}`}
                              day={day}
                              periodId={row.id}
                              subjectName={cell?.subjectName || null}
                              gradeClassId={gc.id}
                              onDrop={handleDrop}
                              isBreak={row.type === "BREAK"}
                            />
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card>
        ))}
        <Button onClick={() => window.location.reload()} className="mt-4">
          Refresh
        </Button>
      </div>
    </DndProvider>
  );
}
