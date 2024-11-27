
import axios from 'axios';

const userapi = axios.create({
    baseURL: 'http://localhost:8000/api',
});

userapi.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const changepassuser = async (email, old_password, new_password, new_password_confirmation) => {
    const response = await userapi.post(`/change-password`, { email, old_password, new_password, new_password_confirmation });
    return response.data;
};
export const changeavatar = async (email, avatar) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('avatar', avatar);
    const response = await userapi.post(`/upload-avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response;
};
export default userapi;