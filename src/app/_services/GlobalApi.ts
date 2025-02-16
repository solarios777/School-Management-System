// src/utils/axios.ts or wherever your axios file is located
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Function to fetch attendance data for a specific student
export const fetchStudentAttendance = async (studentId: string, month?: string) => {
  try {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append('month', month);

    const response = await axiosInstance.get(`/CalenderAtten/${studentId}?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return [];
  }
};

export async function fetchStudentDetails(studentId: string) {
  const res = await fetch(`/api/stuAtten/${studentId}`);
  return res.json();
}



// Existing Functions
export const fetchAttendanceData = async (month?: string, grade?: string, section?: string) => {
  try {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append('month', month);
    if (grade) queryParams.append('grade', grade);
    if (section) queryParams.append('section', section);

    const response = await axiosInstance.get(`/status?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return {
      totalStudents: 0,
      present: 0,
      absent: 0,
      late: 0,
    };
  }
};

export const fetchBarChartData = async (grade?: string, section?: string) => {
  try {
    const queryParams = new URLSearchParams();
    if (grade) queryParams.append("grade", grade);
    if (section) queryParams.append("section", section);

    const response = await axiosInstance.get(
      `/barchart?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    return [];
  }
};

export default axiosInstance;
