// components/ScheduleTables/SubjectItem.tsx
import { useDrag } from "react-dnd";

interface SubjectItemProps {
  subjectName: string;
  weeklyQuota: number;
  disabled: boolean;
  teacherName?: string; // Add teacherName prop
}

export const SubjectItem: React.FC<SubjectItemProps> = ({
  subjectName,
  weeklyQuota,
  disabled,
  teacherName,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "SUBJECT",
    item: { subjectName, teacherName }, // Include teacherName in the drag item
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 rounded ${
        weeklyQuota < 0
          ? "bg-red-500 text-white"
          : "bg-blue-500 text-white"
      } ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-200"}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {subjectName} ({weeklyQuota})
    </div>
  );
};