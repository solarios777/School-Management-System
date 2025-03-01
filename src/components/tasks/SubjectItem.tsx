
import { useDrag } from "react-dnd";

// components/ScheduleTables/SubjectItem.tsx
interface SubjectItemProps {
  subjectName: string;
  weeklyQuota: number;
  disabled: boolean;
}

export const SubjectItem = ({ subjectName, weeklyQuota, disabled }: SubjectItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "SUBJECT",
    item: { subjectName },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 rounded cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-200"}`}
    >
      {subjectName} (Quota: {weeklyQuota})
    </div>
  );
};