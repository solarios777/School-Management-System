import React from 'react';
import StatusCard from './StatusCard';
import { GraduationCap, TrendingDown, TrendingUp } from 'lucide-react';

type AttendanceData = {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
};

type StatusListProps = {
  attendanceData: AttendanceData;
};

const StatusList: React.FC<StatusListProps> = ({ attendanceData }) => {
  const totalStatus = attendanceData.present + attendanceData.absent + attendanceData.late;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      <StatusCard icon={<GraduationCap />} title="Total Students" value={attendanceData.totalStudents} />
      <StatusCard icon={<TrendingUp />} title="Total Present" value={`${((attendanceData.present / totalStatus) * 100 || 0).toFixed(2)}%`} />
      <StatusCard icon={<TrendingDown />} title="Total Absent" value={`${((attendanceData.absent / totalStatus) * 100 || 0).toFixed(2)}%`} />
      <StatusCard icon={<TrendingDown />} title="Total Late" value={`${((attendanceData.late / totalStatus) * 100 || 0).toFixed(2)}%`} />
    </div>
  );
};

export default StatusList;
