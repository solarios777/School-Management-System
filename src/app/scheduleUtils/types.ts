// components/ScheduleTables/types.ts
export interface PeriodRow {
  id: string;
  rollNo: number | null;
  startTime: string;
  endTime: string;
  type: string;
}

export interface GradeClass {
  id: string;
  grade: string | number;
  className: string;
}

export interface SubjectQuota {
  id: string;
  subjectName: string;
  grade: number;
  className: string;
  weeklyQuota: number;
  gradeClassId: string; // Add this property
}

export interface TimetableCell {
  day: string;
  periodId: string;
  subjectName: string | null;
  gradeClassId: string;
}