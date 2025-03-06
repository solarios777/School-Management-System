"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { viewAll } from "@/app/_services/announcement";

// Define the type for an announcement
interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
}

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [limit, setLimit] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await viewAll();
        setAnnouncements(data);
        setTotalCount(data.length);
      } catch (error) {
        console.error("Error loading announcements:", error);
      }
    };

    loadAnnouncements();
  }, []);

  const handleShowMore = () => {
    setLimit((prev) => prev + 5);
  };

  const handleShowLess = () => {
    setLimit(5);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Announcements for you</h1>
      <ScrollArea className="h-[75vh] overflow-y-auto border rounded-md p-4 shadow-sm">
        <div className="space-y-4">
          {announcements.slice(0, limit).map((announcement) => (
            <div
              key={announcement.id}
              className="border p-4 rounded-lg bg-white hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg text-blue-600"
               style={{
                  whiteSpace: "normal", // Ensure text wraps
                  wordBreak: "break-word", // Break long words
                  overflowWrap: "break-word", // Ensure words break properly
                }}>
                {announcement.title}
              </h3>
               <p
                className="text-sm text-gray-700 mt-2"
                style={{
                  whiteSpace: "normal", // Ensure text wraps
                  wordBreak: "break-word", // Break long words
                  overflowWrap: "break-word", // Ensure words break properly
                }}
              >
                {announcement.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(announcement.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-between mt-4">
        {totalCount > limit && (
          <Button
            onClick={handleShowMore}
            className="w-40 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Show More
          </Button>
        )}
        {limit > 5 && (
          <Button
            onClick={handleShowLess}
            className="w-40 bg-gray-200 hover:bg-gray-300 text-gray-800"
            variant="outline"
          >
            Show Less
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;