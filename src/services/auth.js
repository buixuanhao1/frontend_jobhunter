import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/auth";

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
        return response.data; // Trả về dữ liệu API
    } catch (error) {
        console.error("Lỗi đăng nhập:", error.response?.data || error.message);
        return null;
    }
};
