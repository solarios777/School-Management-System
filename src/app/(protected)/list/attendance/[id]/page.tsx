"use client";
import { useSearchParams } from "next/navigation";
import SingleSectionAttendance from "@/components/SingleSectionAtten";

const AttendancePage = () => {
  const searchParams = useSearchParams();
  const gradeId = searchParams.get("gradeId") || "";
  const classId = searchParams.get("classId") || "";

  if (!gradeId || !classId) {
    return <div>No class selected.</div>;
  }

  return (
    <SingleSectionAttendance gradeId={gradeId} classId={classId} />
  );
};

export default AttendancePage;
