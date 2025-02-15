import React from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, Text } from "recharts";

interface AttendanceData {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  presentMale: number;
  presentFemale: number;
  absentMale: number;
  absentFemale: number;
  lateMale: number;
  lateFemale: number;
}

// Matching Colors for Inner and Outer Sections
const COLORS = {
  present: "#4CAF50", // Green
  absent: "#F44336",  // Red
  late: "#FFEB3B",    // Yellow
  presentMale: "  #00BFFF", // Darker Green
  presentFemale: "#32CD32", // Lighter Green
  absentMale: "#CD5C5C", // Darker Red
  absentFemale: "#FFA07A", // Lighter Red
  lateMale: "#FFFFE0", // Darker Yellow
  lateFemale: "#FAFAD2", // Lighter Yellow
};

const PieChartAtten: React.FC<{ attendanceData: AttendanceData }> = ({ attendanceData }) => {
  const { present, absent, late, presentMale, presentFemale, absentMale, absentFemale, lateMale, lateFemale } = attendanceData;

  // Inner Pie Data (Total Present, Absent, Late)
  const dataInner = [
    { name: "P", value: present, color: COLORS.present },
    { name: "A", value: absent, color: COLORS.absent },
    { name: "L", value: late, color: COLORS.late },
  ];

  // Outer Pie Data (Breakdown of Male/Female)
  const dataOuter = [
    { name: "P-M", value: presentMale, color: COLORS.presentMale },
    { name: "P-F", value: presentFemale, color: COLORS.presentFemale },
    { name: "A-M", value: absentMale, color: COLORS.absentMale },
    { name: "A-F", value: absentFemale, color: COLORS.absentFemale },
    { name: "L-M", value: lateMale, color: COLORS.lateMale },
    { name: "L-F", value: lateFemale, color: COLORS.lateFemale },
  ];

  return (
    <div className="flex justify-center items-center bg-gray-100 rounded-xl mt-5">
      <ResponsiveContainer width={730} height={350}>
        <PieChart>
          {/* Inner Pie - Present, Absent, Late */}
          <Pie
            data={dataInner}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={100}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <Text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" fontSize={18} fontWeight="bold">
                  {`${dataInner[index].name} ${(percent * 100).toFixed(0)}%`}
                </Text>
              );
            }}
          >
            {dataInner.map((entry, index) => (
              <Cell key={`inner-${index}`} fill={entry.color} />
            ))}
          </Pie>

          {/* Outer Pie - Male/Female Breakdown */}
          <Pie
            data={dataOuter}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={110}
            outerRadius={140}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <Text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" fontSize={15} fontWeight="bold">
                  {`${dataOuter[index].name} ${(percent * 100).toFixed(0)}%`}
                </Text>
              );
            }}
          >
            {dataOuter.map((entry, index) => (
              <Cell key={`outer-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartAtten;
