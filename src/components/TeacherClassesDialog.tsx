"use client"; // This is a client component

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GradeClass {
  id: string;
  grade: { level: number };
  class: { name: string };
}

interface TeacherClassesDropdownProps {
  assignments: {
    gradeClass: GradeClass;
  }[];
}

const TeacherClassesDropdown = ({ assignments }: TeacherClassesDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button >
          Teacher&apos;s Classes
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {assignments.length === 0 ? (
          <DropdownMenuItem className="text-sm text-gray-500">
            No classes assigned.
          </DropdownMenuItem>
        ) : (
          assignments.map((assignment) => (
            <Link
              key={assignment.gradeClass.id}
              href={`/list/classes/${assignment.gradeClass.id}`} // Link to the respective class
            >
              <DropdownMenuItem className="cursor-pointer">
                {assignment.gradeClass.grade.level}{" "}
                {assignment.gradeClass.class.name}
              </DropdownMenuItem>
            </Link>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeacherClassesDropdown;