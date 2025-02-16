import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface BarCharAttenProps {
  data: {
    name: string;
    present: number;
    absent: number;
    late: number;
  }[];
}

const BarCharAtten: React.FC<BarCharAttenProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="present" stackId="a" fill="#4CAF50">
          <LabelList dataKey="present" position="middle" fill="#000" />
        </Bar>
        <Bar dataKey="late" stackId="a" fill="#FFEB3B">
          <LabelList dataKey="late" position="top" fill="#000" />
        </Bar>
        <Bar dataKey="absent" fill="#F44336">
          <LabelList dataKey="absent" position="top" fill="#000" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarCharAtten;
