// components/ClassScheduleTable.tsx
"use client";

import { useEffect, useState } from "react";
import { Table } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { fetchClassSchedule, fetchPeriodTimetable } from "@/app/_services/scheduleRelated";
import { subjectColors } from "../../app/scheduleUtils/colors";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface ScheduleEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  teacherId: string;
}

interface PeriodRow {
  id: string;
  rollNo: number | null;
  startTime: string | null;
  endTime: string | null;
  type: "CLASS" | "BREAK";
}

interface ClassScheduleTableProps {
  gradeClassId: string;
  type:string
}

export default function ClassScheduleTable({ gradeClassId ,type}: ClassScheduleTableProps) {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [rows, setRows] = useState<PeriodRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        // Fetch the class schedule
        const data = await fetchClassSchedule(gradeClassId);
        setSchedule(data);

        // Fetch timetable periods
        const timetableData = await fetchPeriodTimetable();
        let rollNoCounter = 1;
        const formattedData: PeriodRow[] = timetableData.map((row: any) => {
          const isBreak = row.type === "BREAK";
          return {
            id: row.id,
            rollNo: isBreak ? null : rollNoCounter++,
            startTime: isBreak ? null : row.startTime,
            endTime: isBreak ? null : row.endTime,
            type: row.type,
          };
        });

        setRows(formattedData);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [gradeClassId]);

  if (loading) {
    return <div>Loading schedule...</div>;
  }

  return (
    <Card className="p-4 shadow-lg">
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
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b ${
                  row.type === "BREAK" ? "bg-yellow-200" : ""
                }`}
              >
                <td className="p-2 border text-center">
                  {row.rollNo !== null ? row.rollNo : ""}
                </td>
                <td className="p-2 border">
                  {row.startTime} - {row.endTime}
                </td>
                {days.map((day) => {
                  if (row.type === "BREAK") {
                    return (
                      <td
                        key={`${day}-${row.id}`}
                        className="p-2 border bg-yellow-200"
                      ></td>
                    );
                  }

                  const cell = schedule.find(
                    (entry) =>
                      entry.day === day.toUpperCase() &&
                      entry.startTime === row.startTime &&
                      entry.endTime === row.endTime
                  );

                  if (!cell) {
                    return (
                      <td
                        key={`${day}-${row.id}`}
                        className="p-2 border bg-gray-100"
                      ></td>
                    );
                  }

                  const subject = cell.subject;
                  const teacherName = cell.teacherName;

                  // Determine the background color based on the subject
                  const colorIndex =
                    Math.abs(
                      subject.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
                    ) % subjectColors.length;
                  const backgroundColor = subjectColors[colorIndex];

                  return (
                    <td
                      key={`${day}-${row.id}`}
                      className={`p-2 border ${backgroundColor}`}
                    >
                      <div className="p-2 border rounded-lg">
                        <div>{subject}</div>
                        {type==="class" && <div className="text-sm text-gray-600">{teacherName}</div>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}