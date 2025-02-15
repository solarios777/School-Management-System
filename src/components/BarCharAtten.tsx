import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '15',
    absent: 4000,
    present: 2400,
    amt: 2400,
  },
  {
    name: '14',
    absent: 3000,
    present: 1398,
    late: 2210,
  },
  {
    name: '13',
    absent: 2000,
    present: 9800,
    late: 2290,
  },
  {
    name: '12',
    absent: 2780,
    present: 3908,
    late: 2000,
  },
  {
    name: '11',
    absent: 1890,
    present: 4800,
    late: 2181,
  },
  {
    name: '10',
    absent: 2390,
    present: 3800,
    late: 2500,
  },
  {
    name: '9',
    absent: 3490,
    present: 4300,
    late: 2100,
  },
];


const BarCharAtten = () => {
  return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
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
          <Bar dataKey="present" stackId="a" fill="#8884d8" />
          <Bar dataKey="late" stackId="a" fill="#82ca9d" />
          <Bar dataKey="absent" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    );
}

export default BarCharAtten
