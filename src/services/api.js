import axios from "axios";

const API_BASE_URL = "http://localhost:8080/v1/api/login"; // Thay đổi URL nếu cần

export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return [];
    }
};
