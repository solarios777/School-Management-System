"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { assignTeachforSubjects } from "@/app/_services/scheduleRelated";
import { set } from "date-fns";

type Subject = { id: string; name: string };
type Grade = { id: string; level: number };
type Class = { id: string; name: string };
type Teacher = { id: string; name: string; surname: string };

interface Props {
  subjects: Subject[];
  grades: Grade[];
  classes: Class[];
  teachers: Teacher[];
}

const TeachSubjectGradeClassForm: React.FC<Props> = ({
  subjects,
  grades,
  classes,
  teachers,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<{ [key: string]: string[] }>({});
  const [selectAllSections, setSelectAllSections] = useState<{ [key: string]: boolean }>({});
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [academicYears, setAcademicYears] = useState<string[]>([]);

  const sortedGrades = [...grades].sort((a, b) => a.level - b.level);
  const sortedClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name));
  const sortedSubjects = [...subjects].sort((a, b) => a.name.localeCompare(b.name));
  const sortedTeachers = [...teachers].sort((a, b) => a.name.localeCompare(b.name));

 const handleGradeSelection = (gradeId: string) => {
    setSelectedGrades((prev) => {
      const updated = prev.includes(gradeId) ? prev.filter((id) => id !== gradeId) : [gradeId, ...prev];
      return updated;
    });
  };
  const handleSectionSelection = (gradeId: string, sectionId: string) => {
    setSelectedSections((prev) => ({
      ...prev,
      [gradeId]: prev[gradeId]?.includes(sectionId)
        ? prev[gradeId].filter((id) => id !== sectionId)
        : [...(prev[gradeId] || []), sectionId],
    }));
  };

  const toggleSelectAllSections = (gradeId: string) => {
    setSelectAllSections((prev) => ({
      ...prev,
      [gradeId]: !prev[gradeId],
    }));

    setSelectedSections((prev) => ({
      ...prev,
      [gradeId]: !selectAllSections[gradeId] ? sortedClasses.map((cls) => cls.id) : [],
    }));
  };

  const handleSubmit = async () => {
    if (!selectedTeacher || !selectedSubject || Object.keys(selectedSections).length === 0) {
      alert("Please select a teacher, subject, grades, and sections.");
      return;
    }

    try {
      await assignTeachforSubjects(selectedSubject, selectedSections, selectedTeacher, selectedYear);
      alert("Subject assigned successfully!");
      setShowDialog(false);
      setSelectedSubject("");
      setSelectedSections({});
      setSelectedGrades([]);
      setSelectAllSections({});
      setSelectedTeacher("");
      setSelectedYear("");
    } catch (error) {
      alert("Failed to assign subject. Please try again.");
    }
  };

  useEffect(() => {
    const generateAcademicYears = () => {
      const currentYear = new Date().getFullYear();
      const startYear = new Date().getMonth() + 1 < 9 ? currentYear - 1 : currentYear;
      return Array.from({ length: 5 }, (_, i) => `${startYear + i - 2}/${(startYear + i - 1) % 100}`);
    };
    setAcademicYears(generateAcademicYears());
  }, []);

  return (
    <>
      <Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => setShowDialog(true)}>
        Assign Teacher & Subject
      </Button>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader className="text-lg font-bold">Assign Teacher for Subject</DialogHeader>
          <div className="space-y-4">
            
            {/* Scrollable Teacher Selection */}
            <Select onValueChange={setSelectedTeacher}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Teacher" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-48 overflow-y-auto border rounded-md p-2">
                  {sortedTeachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name} {teacher.surname}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>

            {/* Academic Year Selection */}
            <Select onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Academic Year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Scrollable Subject Selection */}
            <Select onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Subject" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-48 overflow-y-auto border rounded-md p-2">
                  {sortedSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>

            {/* Grade Selection */}
            <Select onValueChange={handleGradeSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Select Grades" />
              </SelectTrigger>
              <SelectContent>
                {sortedGrades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    Grade {grade.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Scrollable Section Selection */}
            <ScrollArea className="h-72 overflow-y-auto border rounded-md p-4">
              <div className="border p-5 rounded-lg bg-gray-50">
                <p className="font-semibold mb-4">Select Sections</p>
                {selectedGrades.map((gradeId) => {
                  const grade = sortedGrades.find((g) => g.id === gradeId);
                  return (
                    <div key={gradeId} className="mb-5">
                      <div className="flex items-center space-x-3">
                        <label className="font-medium">Grade {grade?.level}</label>
                        <Button size="sm" variant="outline" onClick={() => toggleSelectAllSections(gradeId)}>
                          {selectAllSections[gradeId] ? "Deselect All Sections" : "Select All Sections"}
                        </Button>
                      </div>

                      <div className="ml-6 grid grid-cols-4 gap-4 mt-4">
                        {sortedClasses.map((cls) => (
                          <div key={cls.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedSections[gradeId]?.includes(cls.id)}
                              onCheckedChange={() => handleSectionSelection(gradeId, cls.id)}
                            />
                            <label className="text-sm">{cls.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeachSubjectGradeClassForm;
