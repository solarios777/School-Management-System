"use client";
import { useSearchParams } from "next/navigation";
import SingleSectionAttendance from "@/components/SingleSectionAtten";
import SingleSectionResult from "@/components/resultComponents/singleSectionResults";

const AttendancePage = () => {
  const searchParams = useSearchParams();
  const gradeId = searchParams.get("gradeId") || "";
  const classId = searchParams.get("classId") || "";

  if (!gradeId || !classId) {
    return <div>No class selected.</div>;
  }

  return (
    <SingleSectionResult gradeId={gradeId} classId={classId} />
  );
};

export default AttendancePage;
