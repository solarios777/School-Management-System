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

interface AnnouncementData {
  title: string;
  description: string;
  isForWholeSchool: boolean;
  isForTeachers: boolean;
  isForParents: boolean;
  gradeIds?: string[];
  classIds?: string[];
}

export const createAnnouncement = async (data: AnnouncementData) => {
  try {
    const response = await axiosInstance.post("/announcement/createAnnouncement", data);
    return response.data;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};
interface FetchAnnouncementsParams {
  limit?: number;
  offset?: number;
  filter?: string;
  gradeId?: any;
  classId?: any;
}

export const fetchAnnouncements = async ({
  limit = 5,
  offset = 0,
  filter = "all",
  gradeId,
  classId,
}: FetchAnnouncementsParams) => {
  try {
    const response = await axiosInstance.get("/announcement/fetchAnnouncement", {
      params: { limit, offset, filter, gradeId, classId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string) => {
  try {
    const response = await axiosInstance.delete('/announcement/deleteAnnouncement', {
      data: { id }, // Pass the id in the request body
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

export const updateAnnouncement = async (id: string, data: any) => {
  try {
    // Include the id in the request body
    const payload = { id, ...data };
    const response = await axiosInstance.put(`/announcement/editAnnouncement`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};
export default axiosInstance;