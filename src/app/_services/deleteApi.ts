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

export const deleteAssessment = async (
  year: string,
  semester: string,
  gradeId: string,
  classId: string,
  subjectId: string,
  examType: string,
) => {
  
  try {
    const response = await axiosInstance.delete("/Delete/deleteAssessment", {
      data: { year, semester, gradeId, classId, subjectId, examType },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return { success: false, message: "Failed to delete assessment." };
  }
};

export const teachersDelete = async (teacherId: string) => {
  try {
    const response = await axiosInstance.delete(`/Delete/teacherDelete`, {
      data: { teacherId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return { success: false, message: "Failed to delete teacher." };
  }
};
export const studentsDelete = async (teacherId: string) => {
  try {
    const response = await axiosInstance.delete(`/Delete/studentDelete`, {
      data: { teacherId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return { success: false, message: "Failed to delete teacher." };
  }
};
export const parentsDelete  = async (teacherId: string) => {
  try {
    const response = await axiosInstance.delete(`/Delete/parentDelete`, {
      data: { teacherId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return { success: false, message: "Failed to delete teacher." };
  }
};

export default axiosInstance;