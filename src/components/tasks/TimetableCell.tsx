
import { useDrop } from "react-dnd";

interface TimetableCellProps {
  day: string;
  periodId: string;
  subjectName: string | null;
  gradeClassId: string;
  onDrop: (subjectName: string, day: string, periodId: string, gradeClassId: string) => void;
  isBreak: boolean;
}

export const TimetableCell = ({
  day,
  periodId,
  subjectName,
  gradeClassId,
  onDrop,
  isBreak,
}: TimetableCellProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "SUBJECT",
    drop: (item: { subjectName: string }) => onDrop(item.subjectName, day, periodId, gradeClassId),
    canDrop: () => !isBreak,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <td
      ref={drop}
      className={`p-2 border ${isBreak ? "bg-yellow-200 border-yellow-200" : "bg-white"} ${
        isOver && !isBreak ? "bg-green-100" : ""
      }`}
    >
      {subjectName || "—"}
    </td>
  );
};