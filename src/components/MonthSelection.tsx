"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button"; // Import Button from shadcn
import { CalendarDays } from "lucide-react";
import { addMonths } from "date-fns";
import moment from "moment";
import { Calendar } from "@/components/ui/calendar";

interface MonthSelectionProps {
  selectedMonth: (value: Date) => void;
}

const MonthSelection: React.FC<MonthSelectionProps> = ({ selectedMonth }) => {
  const today = new Date();
  const nextMonth = addMonths(today, 0); // Use 'today' instead of creating a new Date()
  const [Month, setMonth] = useState<Date>(nextMonth);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {moment(Month).format("MMMM, YYYY")}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            month={Month}
            onMonthChange={(value) => {
              selectedMonth(value);
              setMonth(value);
            }}
            className="flex flex-1 justify-center items-center"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthSelection;