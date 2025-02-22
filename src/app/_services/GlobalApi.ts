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
// export const fetchResults = async (grade: string, section: string, examType: string) => {
//   try {
//     const response = await axios.get('/results', {
//       params: {
//         grade,
//         section,
//         examType,
//       },
//     });
//     return "true true";
//   } catch (error) {
//     console.error('Error fetching results:', error);
//     throw error;
//   }
// };
// Fetches grades, sections, and subjects for the current user
export const fetchUserSelections = async () => {
  try {
    const response = await axiosInstance.get('/fetchTeacherData');
    return response.data;
  } catch (error) {
    console.error('Error fetching user selections:', error);
    return { grades: [], sections: [], subjects: [] };
  }
};
export const fetchStudents = async (
  year: string,
  semester: string,
  gradeId: string,
  classId: string,
  subjectId: string
) => {
  try {
    const response = await axiosInstance.get("/fetchStudentsforResult", {
      params: { year, semester, gradeId, classId, subjectId },
    });

    // Transform student data to merge results into a single object
    const transformedStudents = response.data.map((student: any) => {
      const transformedResults = student.result.reduce((acc: any, res: any) => {
        acc[res.examType] = res.marks; // Convert examType into a key and assign marks
        return acc;
      }, {});

      return {
        ...student,
        ...transformedResults, // Spread the transformed results into the student object
      };
    });

    return transformedStudents;
  } catch (error) {
    console.error("Error fetching students:", error);
    return {
      message: error,
    };
  }
};

export const submitNormalResults = async (results: any[]) => {
  try {
    const response = await axiosInstance.post("/submitResults/submitNormalresult", results);
    return response.data;
  } catch (error) {
    console.error("Error submitting results:", error);
    throw error;
  }
};
export const submitUploadedResults = async (results: any[]) => {
  try {
    const response = await axiosInstance.post("/submitResults/uploadSubmit", results);
    return response.data;
  } catch (error) {
    console.error("Error submitting results:", error);
    throw error;
  }
};

export const fetchStudentResults = async (studentId: string) => {
  try {
    const response = await axiosInstance.get(`/results/singlestudentResult?studentId=${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student results:", error);
    throw error;
  }
};

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
export const setResultDeadline = async (year: string, semester: number, deadline: string) => {
  try {
    const response = await axiosInstance.post("/admin/resultRelease", {
      year,
      semester,
      deadline,
    });
    return response.data;
  } catch (error) {
    console.error("Error setting result deadline:", error);
    throw new Error("Failed to set result deadline.");
  }
};

export const getResultDeadline = async (year: string, semester: number) => {
  try {
    const response = await axiosInstance.get(`/admin/getdeadline?year=${year}&semester=${semester}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching result deadline:", error);
    throw new Error("Failed to fetch result deadline.");
  }
};

export const getNearestDeadline = async () => {
  try {
    const response = await fetch("/api/admin/resultRelease", {
      method: "GET",
    });
    if (!response.ok) throw new Error("Failed to fetch nearest deadline");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};




export default axiosInstance;
