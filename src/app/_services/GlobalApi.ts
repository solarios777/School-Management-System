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

// New function to fetch attendance data
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

export default axiosInstance;
