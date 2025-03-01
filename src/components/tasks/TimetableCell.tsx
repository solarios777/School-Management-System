// components/ScheduleTables/TimetableCell.tsx
import React from "react";
import { useDrop } from "react-dnd";

// components/ScheduleTables/TimetableCell.tsx
// components/ScheduleTables/TimetableCell.tsx
interface TimetableCellProps {
  day: string;
  periodId: string;
  subjectName: string | null;
  teacherName?: string | null;
  gradeClassId: string;
  onDrop: (
    subjectName: string,
    day: string,
    periodId: string,
    gradeClassId: string,
    teacherName: string
  ) => void;
  isBreak: boolean;
  subjectColor?: string;
}

export const TimetableCell: React.FC<TimetableCellProps> = ({
  day,
  periodId,
  subjectName,
  teacherName,
  gradeClassId,
  onDrop,
  isBreak,
  subjectColor,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "SUBJECT",
    drop: (item: { subjectName: string; teacherName: string }) => {
      if (!isBreak) {
        onDrop(item.subjectName, day, periodId, gradeClassId, item.teacherName);
      }
    },
    canDrop: () => !isBreak,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const backgroundColor = subjectColor || "bg-white";

  return (
    <td
      ref={drop}
      className={`p-2 border ${
        isOver && !isBreak ? "bg-gray-300" : backgroundColor
      } ${isBreak ? "bg-yellow-200" : ""}`}
    >
      {subjectName && (
        <div>
          <div>{subjectName}</div>
          {teacherName && <div className="text-sm text-gray-600">{teacherName}</div>}
        </div>
      )}
    </td>
  );
};