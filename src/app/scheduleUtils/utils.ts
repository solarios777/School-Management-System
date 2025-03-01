// components/ScheduleTables/utils.ts
import { GradeClass } from "./types";

export const sortGradeClasses = (gradeClasses: GradeClass[]) => {
  return gradeClasses.sort((a, b) => {
    if (a.grade === b.grade) {
      return a.className.localeCompare(b.className);
    }
    return parseInt(a.grade.toString()) - parseInt(b.grade.toString());
  });
};