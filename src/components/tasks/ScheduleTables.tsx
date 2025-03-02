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
  fetchSchedules,
  fetchSubjectsandQuota,
  upsertSchedule,
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
import { subjectColors } from "../../app/scheduleUtils/colors";
import { toast } from "react-toastify";

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


  const [academicYear, setAcademicYear] = useState("");

useEffect(() => {
  const generateAcademicYear = () => {
    const currentYear = new Date().getFullYear();
    const startYear = new Date().getMonth() + 1 < 9 ? currentYear - 1 : currentYear;
    return `${startYear}/${(startYear + 1) % 100}`; // e.g., "2024/25"
  };

  setAcademicYear(generateAcademicYear());
}, []);

const handleSubmit = async (gradeClassId: string) => {
  try {
    const gradeClassTimetable = timetable.filter(
      (cell) => cell.gradeClassId === gradeClassId
    );

    const scheduleData = gradeClassTimetable
      .filter((cell) => cell.subjectName)
      .map((cell) => {
        const subject = subjectsAndQuotas.find(
          (sub) =>
            sub.subjectName === cell.subjectName &&
            sub.gradeClassId === gradeClassId
        );

        if (!subject) {
          throw new Error(
            `Subject not found for ${cell.subjectName} in grade class ${gradeClassId}`
          );
        }

        return {
          day: cell.day.toUpperCase(),
          startTime: rows[gradeClassId]?.find((row) => row.id === cell.periodId)?.startTime,
          endTime: rows[gradeClassId]?.find((row) => row.id === cell.periodId)?.endTime,
          subjectName: cell.subjectName,
          subjectId: subject.id, // Ensure subjectId is valid
          teacherId: cell.teacherId,
          gradeClassId: cell.gradeClassId,
          year: academicYear,
        };
      });

    for (const entry of scheduleData) {
      if (!entry.subjectId) {
        throw new Error(`Invalid subjectId for ${entry.subjectName}`);
      }
      if(!entry.startTime || !entry.endTime){
        throw new Error(`invalid start time or endtim`)
      }

      await upsertSchedule(
        entry.day,
        entry.startTime,
        entry.endTime,
        entry.subjectId,
        entry.gradeClassId,
        entry.teacherId,
        entry.year
      );
    }

    toast.success("Schedule updated successfully!");
  } catch (error) {
    toast.error("Failed to submit schedule:");
  }
};

  useEffect(() => {
  const loadData = async () => {
    try {
      // Fetch grade classes
      const gradeClassData = await fetchGradeClasses();
      const sortedGradeClasses = sortGradeClasses(gradeClassData);
      setGradeClasses(sortedGradeClasses);
      setFilteredGradeClasses(sortedGradeClasses);

      // Fetch existing schedules
      const existingSchedules = await fetchSchedules();

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
      const assignSubjectColors = (subjects: SubjectQuota[]) => {
        const sortedSubjects = [...subjects].sort((a, b) =>
          a.subjectName.localeCompare(b.subjectName)
        );
        return sortedSubjects.map((subject, index) => ({
          ...subject,
          color: subjectColors[index % subjectColors.length],
        }));
      };

      const formattedSubjectsData = subjectsData.map((sub: any) => ({
        ...sub,
        gradeClassId: sub.gradeClassId,
      }));

      const subjectsWithColors = assignSubjectColors(formattedSubjectsData);
      setSubjectsAndQuotas(subjectsWithColors);

      // Initialize timetable cells
      const initialTimetable: TimetableCellType[] = [];
      sortedGradeClasses.forEach((gc: GradeClass) => {
        days.forEach((day) => {
          formattedData.forEach((period: PeriodRow) => {
            // Check if there's an existing schedule for this cell
            const existingSchedule = existingSchedules.find(
              (s) =>
                s.grade === gc.grade &&
                s.className === gc.className &&
                s.day === day.toUpperCase() &&
                s.startTime === period.startTime &&
                s.endTime === period.endTime
            );

            initialTimetable.push({
              day,
              periodId: period.id,
              subjectName: existingSchedule ? existingSchedule.subject : null,
              gradeClassId: gc.id,
              teacherName: existingSchedule ? existingSchedule.teacherName : "",
              teacherId: existingSchedule ? existingSchedule.teacherId : "",
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
  gradeClassId: string,
  teacherName: string,
  teacherId:string
) => {
  setTimetable((prev) =>
    prev.map((cell) => {
      if (
        cell.day === day &&
        cell.periodId === periodId &&
        cell.gradeClassId === gradeClassId
      ) {
        // If replacing a subject, increment its quota
        if (cell.subjectName) {
          setSubjectsAndQuotas((prevQuotas) =>
            prevQuotas.map((sub) =>
              sub.subjectName === cell.subjectName && sub.gradeClassId === gradeClassId
                ? { ...sub, weeklyQuota: sub.weeklyQuota + 1 }
                : sub
            )
          );
        }
        // Decrease the quota for the new subject
        setSubjectsAndQuotas((prevQuotas) =>
          prevQuotas.map((sub) =>
            sub.subjectName === subjectName && sub.gradeClassId === gradeClassId
              ? { ...sub, weeklyQuota: sub.weeklyQuota - 1 }
              : sub
          )
        );
        return { ...cell, subjectName, teacherName ,teacherId}; // Update the cell with the new subject
      }
      return cell;
    })
  );
};


  const handleRemoveSubject = (
    day: string,
    periodId: string,
    gradeClassId: string,
    
  ) => {
    setTimetable((prev) =>
      prev.map((cell) => {
        if (
          cell.day === day &&
          cell.periodId === periodId &&
          cell.gradeClassId === gradeClassId
          
        ) {
          // Increment the quota for the removed subject
          if (cell.subjectName) {
            setSubjectsAndQuotas((prevQuotas) =>
              prevQuotas.map((sub) =>
                sub.subjectName === cell.subjectName && sub.gradeClassId === gradeClassId
                  ? { ...sub, weeklyQuota: sub.weeklyQuota + 1 }
                  : sub
              )
            );
          }
          return { ...cell, subjectName: null, teacherName: "", teacherId:"" }; // Clear the cell
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
            className="w-full p-2 border rounded "
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
                  .filter((sub) => sub.gradeClassId === gc.id)
                  .map((sub) => (
                    <SubjectItem
                      key={sub.id}
                      subjectName={sub.subjectName}
                      weeklyQuota={sub.weeklyQuota}
                      disabled={sub.weeklyQuota === 0}
                      teacherName={sub.teacherName} // Pass teacherName to SubjectItem
                      teacherId={sub.teacherId}
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
                          const subject = subjectsAndQuotas.find(
                            (sub) =>
                              sub.subjectName === cell?.subjectName &&
                              sub.gradeClassId === gc.id
                          );
                          return (
                            <TimetableCell
                              key={`${day}-${row.id}`}
                              day={day}
                              periodId={row.id}
                              subjectName={cell?.subjectName || null}
                              teacherName={cell?.teacherName || null}
                              teacherId={cell?.teacherId || null}
                              gradeClassId={gc.id}
                              onDrop={handleDrop}
                              onRemove={handleRemoveSubject} // Pass the remove function
                              subjectColor={subject?.color} // Pass the subject's color
                              isBreak={row.type === "BREAK"} // Pass isBreak prop
                            />
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
             {/* Add a Submit Button for Each Grade Section */}
    <Button
      onClick={() => handleSubmit(gc.id)}
      className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
    >
      Submit Schedule for {gc.grade} {gc.className}
    </Button>
          </Card>
        ))}
        <Button onClick={() => window.location.reload()} className="mt-4">
          Refresh
        </Button>
      </div>
    </DndProvider>
  );
}
