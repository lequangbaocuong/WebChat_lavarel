
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

export const changepassuser = async (email, old_password, new_password) => {
    const response = await userapi.post(`/change-password`, { email, old_password, new_password });
    return response.data;
};
export default userapi;
