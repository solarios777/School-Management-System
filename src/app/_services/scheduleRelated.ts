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


export const updateSchedule = async (id: string, updatedData: any) => {
  try {
    const response = await axiosInstance.put(`/tasksApi/editSchedule/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating schedule:", error);
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
