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

export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await axiosInstance.put("/changePassword/normalChange", {
      currentPassword,
      newPassword,
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to change password";
  }
};
export const AdminChangePassword = async (
  currentPassword: string,
  newPassword: string,
  username: string,
  role: string
): Promise<any> => {
  try {
    const response = await axiosInstance.post("/changePassword/adminChange", {
      currentPassword,
      newPassword,
      username,
      role,
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to change password";
  }
};

export default axiosInstance;