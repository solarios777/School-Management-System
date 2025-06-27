import axios from 'axios';

interface ErrorResponse {
  error: string;
  details?: {
    teacherName?: string;
    gradeLevel?: string;
    className?: string;
    day?: string;
    period?: string;
  } | null;
}

// Define the structure of the success response locally
interface SuccessResponse {
  success: boolean;
  schedule: any; // Replace 'any' with a more specific type if you have a Schedule interface
}
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



export const assignSubjects = async (selectedSubjects: string[], selectedSections: Record<string, string[]>) => {
  try {
    const response = await axiosInstance.post("/tasksApi/subSecGradeRelation", {
      selectedSubjects, // Send array instead of single subjectId
      selectedSections,
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning subjects:", error);
    throw error;
  }
};
export const assignTeachforSubjects = async (subjectId: string, selectedSections: Record<string, string[]>, teacherId: string, year: string) => {
  try {
    const response = await axiosInstance.post("/tasksApi/TeachSubClassRelation", {
      subjectId,
      selectedSections,
      teacherId,
      year
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning subjects:", error);
    throw error;
  }
};

export const savePeriodTimetable = async (timetable: any[]) => {
  try {
    const response = await axiosInstance.post("/tasksApi/setTimeTable", {
      timetable,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving timetable:", error);
    throw error;
  }
};


export const fetchPeriodTimetable = async () => {
  try {
    const response = await axiosInstance.get("/tasksApi/fetchTimeTable");
    return response.data.timetable; // Ensure the API returns an object with `timetable` array
  } catch (error) {
    console.error("Error fetching period timetable:", error);
    throw error;
  }
};





export const fetchGradeClasses = async () => {
  try {
    const response = await axiosInstance.get('/tasksApi/FetchGradeforS');
    return response.data;
  } catch (error) {
    console.error('Error fetching grade classes:', error);
    throw error;
  }
};

export const fetchSubjectsandQuota = async () => {
   try {
    const response = await axiosInstance.get('/tasksApi/fetchSubjectQuota');
    return response.data;
  } catch (error) {
    console.error('Error fetching grade classes:', error);
    throw error;
  }
};



export const assignSubjectQuota = async (selectedSubjects: string[], selectedSections: Record<string, string[]>, weeklyQuota: number) => {
  try {
    const response = await axiosInstance.post("/tasksApi/subjectQouta", {
      selectedSubjects,
      selectedSections,
      weeklyQuota,
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning subject quota:", error);
    throw error;
  }
};


export const generateSchedule = async (year: string, maxWorkload: number) => {
  try {
    const response = await axiosInstance.post("/tasksApi/generateSchedule", { year, maxWorkload });
    return response.data;
  } catch (error) {
    console.error("Error generating schedule:", error);
    throw error;
  }
};


export const fetchSchedules = async () => {
  try {
    const response = await axiosInstance.get("/tasksApi/fetchSchedule");
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};


export const fetchTeachers = async () => {
  try {
    const response = await axiosInstance.get("/tasksApi/teacherforSchedule");
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const fetchTeacherSchedule = async (teacherId: string) => {
  try {
    const response = await axiosInstance.get(`/tasksApi/teacherforSchedule?teacherId=${teacherId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher schedule:", error);
    throw error;
  }
};


// utils/scheduleUtils.ts


export const upsertSchedule = async (
  day: string,
  startTime: string,
  endTime: string,
  subjectId: string,
  gradeClassId: string,
  teacherId: string,
  year: string,
 
) => {
  try {
    const response = await axiosInstance.post("/tasksApi/editSchedule", {
      day,
      startTime,
      endTime,
      subjectId,
      gradeClassId,
      teacherId,
      year,
    });

    // Return the success response from the backend
    return response.data;
  } catch (error:any) {
    // Handle Axios errors and return a consistent error structure
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        error: error.response.data.error || "Failed to handle schedule",
        details: error.response.data.details || null,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        error: "No response received from the server",
        details: null,
      };
    } else {
      // Something happened in setting up the request that triggered an error
      return {
        error: "Failed to handle schedule",
        details: null,
      };
    }
  }
};
export const fetchClassSchedule = async (gradeClassId: string) => {
  try {
    const response = await axiosInstance.get(`/tasksApi/fetchClassSchedule?gradeClassId=${gradeClassId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching class schedule:", error);
    throw error;
  }
};

export const deleteSchedule = async (id: string) => {
  try {
    await axiosInstance.delete(`/tasksApi/editSchedule/${id}`);
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};



export default axiosInstance;
