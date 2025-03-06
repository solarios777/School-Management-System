"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { createAnnouncement } from "@/app/_services/announcement";
import { useRouter } from "next/navigation";

type Grade = { id: string; level: number };
type Class = { id: string; name: string };

interface Props {
  grades: Grade[];
  classes: Class[];
}

const AnnouncementPage: React.FC<Props> = ({ grades, classes }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isForWholeSchool, setIsForWholeSchool] = useState(false);
  const [isForTeachers, setIsForTeachers] = useState(false);
  const [isForParents, setIsForParents] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<{ [key: string]: string[] }>({});
  const [selectAllSections, setSelectAllSections] = useState<{ [key: string]: boolean }>({});
  const [showDialog, setShowDialog] = useState(false);
const router=useRouter();
  // Sorting data
  const sortedGrades = [...grades].sort((a, b) => a.level - b.level);
  const sortedClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name));

  const handleGradeSelection = (gradeId: string) => {
    setSelectedGrades((prev) =>
      prev.includes(gradeId) ? prev.filter((id) => id !== gradeId) : [...prev, gradeId]
    );
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
    if (!title || !description) {
      toast.error("Please fill in the title and description.");
      return;
    }

    if (
      !isForWholeSchool &&
      !isForTeachers &&
      !isForParents &&
      selectedGrades.length === 0 &&
      Object.keys(selectedSections).length === 0
    ) {
      toast.error("Please select at least one target audience (whole school, teachers, parents, grades, or sections).");
      return;
    }

    const announcementData = {
      title,
      description,
      isForWholeSchool,
      isForTeachers,
      isForParents,
      gradeIds: isForWholeSchool ? [] : selectedGrades,
      classIds: isForWholeSchool ? [] : Object.values(selectedSections).flat(),
    };

    try {
      const response = await createAnnouncement(announcementData);
      toast.success("Announcement created successfully!");
      setShowDialog(false);
      
  router.refresh();
      setTitle("");
      setDescription("");
      setIsForWholeSchool(false);
      setIsForTeachers(false);
      setIsForParents(false);
      setSelectedGrades([]);
      setSelectedSections({});
    } catch (error) {
      toast.error("Failed to create announcement. Please try again.");
    }
  }

  return (
    <div className="p-6">
      <Button onClick={() => setShowDialog(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Create Announcement
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="text-lg font-bold">Create Announcement</DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whole-school"
                  checked={isForWholeSchool}
                  onCheckedChange={() => setIsForWholeSchool(!isForWholeSchool)}
                />
                <label htmlFor="whole-school" className="text-sm">
                  Announcement for the whole school
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="teachers"
                  checked={isForTeachers}
                  onCheckedChange={() => setIsForTeachers(!isForTeachers)}
                />
                <label htmlFor="teachers" className="text-sm">
                  Announcement for teachers
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parents"
                  checked={isForParents}
                  onCheckedChange={() => setIsForParents(!isForParents)}
                />
                <label htmlFor="parents" className="text-sm">
                  Announcement for parents
                </label>
              </div>
            </div>

            {!isForWholeSchool && !isForTeachers && !isForParents && (
              <>
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
              </>
            )}

            <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
              Create Announcement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementPage;