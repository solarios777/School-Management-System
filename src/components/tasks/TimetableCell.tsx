import React from "react";
import { useDrop } from "react-dnd";

interface TimetableCellProps {
  day: string;
  periodId: string;
  subjectName: string | null;
  teacherName?: string | null;
  teacherId?: string | null;
  gradeClassId: string;
  onDrop: (
    subjectName: string,
    day: string,
    periodId: string,
    gradeClassId: string,
    teacherName: string,
    teacherId: string,
  ) => void;
  onRemove: (day: string, periodId: string, gradeClassId: string) => void;
  isBreak: boolean;
  subjectColor?: string;
}

export const TimetableCell: React.FC<TimetableCellProps> = ({
  day,
  periodId,
  subjectName,
  teacherName = "", 
  teacherId = "", 
  gradeClassId,
  onDrop,
  onRemove,
  subjectColor,
  isBreak,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "SUBJECT",
    drop: (item: { subjectName: string; teacherName: string }) => {
      if (!isBreak) {
        onDrop(item.subjectName, day, periodId, gradeClassId, item.teacherName, item.teacherId);
      }
    },
    canDrop: () => !isBreak, // Disable drops for break cells
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Determine the background color
  const backgroundColor = subjectColor || "bg-white";

  return (
    <td
      ref={drop}
      className={`p-2 border ${
        isOver && !isBreak ? "bg-gray-300" : backgroundColor
      } ${isBreak ? "bg-yellow-200" : ""}`}
    >
      {subjectName && (
        <div className="flex justify-between p-2 border rounded-lg group">
          <div>
            <div>{subjectName}</div>
            {teacherName && (
              <div className="text-sm text-gray-600">{teacherName}</div>
            )}
          </div>

          {/* Remove Subject Button */}
          <button
            onClick={() => onRemove(day, periodId, gradeClassId)}
            className="relative text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-red-500 rounded-full w-6 h-6 flex items-center justify-center"
            aria-label={`Remove ${subjectName}`} // Accessibility improvement
          >
            X
          </button>
        </div>
      )}
    </td>
  );
};