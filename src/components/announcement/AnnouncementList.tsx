"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "react-toastify";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchAnnouncements, deleteAnnouncement } from "@/app/_services/announcement";
import { Edit, Trash } from "lucide-react";
import EditAnnouncementDialog from "./EditAnnouncementDialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Define types
type Grade = { id: string; level: number };
type Class = { id: string; name: string };
type Announcement = {
  id: string;
  title: string;
  description: string;
  date: Date;
  isForTeachers: boolean;
  isForWholeSchool:boolean;
  isForParents: boolean;
  gradeIds: string[];
  classIds: string[];
  
};

interface Props {
  grades: Grade[];
  classes: Class[];
}

const AnnouncementList: React.FC<Props> = ({ grades, classes }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filter, setFilter] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [sectionsForSelectedGrade, setSectionsForSelectedGrade] = useState<Class[]>([]);
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, [filter, selectedGrade, selectedSection, limit]);

  useEffect(() => {
    if (selectedGrade) {
      const sections = classes.filter((cls) =>
        cls.name.startsWith(`Grade ${grades.find((g) => g.id === selectedGrade)?.level}`)
      );
      setSectionsForSelectedGrade(sections);
    } else {
      setSectionsForSelectedGrade([]);
    }
  }, [selectedGrade, grades, classes]);

  const loadAnnouncements = async () => {
    try {
      const data = await fetchAnnouncements({
        limit,
        filter,
        gradeId: selectedGrade,
        classId: selectedSection,
      });
      setAnnouncements(data.announcements);
      setTotalCount(data.totalCount);
    } catch (error) {
      toast.error("Failed to load announcements.");
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setSelectedGrade(null);
    setSelectedSection(null);
    setLimit(5); // Reset to initial limit
  };

  const handleShowMore = () => {
    setLimit((prev) => prev + 10); // Increase limit by 10
  };

  const handleShowLess = () => {
    setLimit(5); // Reset to initial limit
  };

  const handleDeleteConfirmation = (id: string) => {
    setAnnouncementToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!announcementToDelete) return;

    try {
      await deleteAnnouncement(announcementToDelete);
      toast.success("Announcement deleted successfully!");
      loadAnnouncements(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete announcement.");
    } finally {
      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditAnnouncement(announcement);
  };

  const handleEditClose = () => {
    setEditAnnouncement(null);
    loadAnnouncements(); // Refresh the list after editing
  };

  const getAnnouncementTarget = (announcement: Announcement) => {
    if(announcement.isForWholeSchool) return "All"
    if (announcement.isForTeachers) return "Teachers";
    if (announcement.isForParents) return "Parents";
    if (announcement.gradeIds.length > 0) {
      const gradeLevels = announcement.gradeIds
        .map((gradeId) => grades.find((g) => g.id === gradeId)?.level)
        .join(", ");
      return `Grades: ${gradeLevels}`;
    }
    if (announcement.classIds.length > 0) {
      const classNames = announcement.classIds
        .map((classId) => classes.find((c) => c.id === classId)?.name)
        .join(", ");
      return `Sections: ${classNames}`;
    }
    return "All";
  };

  const sortedGrades = [...grades].sort((a, b) => a.level - b.level);
  const sortedClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Select onValueChange={handleFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="teachers">Teachers</SelectItem>
            <SelectItem value="parents">Parents</SelectItem>
            <SelectItem value="grade">Grade</SelectItem>
            <SelectItem value="section">Section</SelectItem>
          </SelectContent>
        </Select>

        {filter === "grade" && (
          <Select onValueChange={setSelectedGrade}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {sortedGrades.map((grade) => (
                <SelectItem key={grade.id} value={grade.id}>
                  Grade {grade.level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {filter === "section" && (
          <>
            <Select onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                {sortedGrades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    Grade {grade.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedSection}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {sectionsForSelectedGrade.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      <ScrollArea className="h-[60vh] overflow-y-auto border rounded-md p-4">
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-bold cursor-pointer">{announcement.title}</h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Announced for: {getAnnouncementTarget(announcement)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(announcement)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteConfirmation(announcement.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete the announcement.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <p className="text-sm">{announcement.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(announcement.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-between">
        {totalCount > limit && (
          <Button onClick={handleShowMore} className="w-40">
            Show More
          </Button>
        )}
        {limit > 5 && (
          <Button onClick={handleShowLess} className="w-40" variant="outline">
            Show Less
          </Button>
        )}
      </div>

      {editAnnouncement && (
        <EditAnnouncementDialog
          announcement={editAnnouncement}
          onClose={handleEditClose}
          grades={grades}
          classes={classes}
        />
      )}
    </div>
  );
};

export default AnnouncementList;