
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const adduser = async (username, email, role_id) => {
    const password = "123456789"
    const response = await api.post('/admin/adduser', { username, email, password, role_id });
    return response.data;
}
export const getuser = async () => {
    const response = await api.get('/admin');
    return response.data;
};
export const deleteuser = async (selectedUser) => {
    const response = await api.delete(`/admin/deleteuser/${selectedUser}`);
    return response.data;
};
export const edituser = async (selectedUser, username, email, role_id) => {
    const response = await api.put(`/admin/edituser/${selectedUser}`, { username, email, role_id });
    return response.data;
};


export const addroom = async (email, name, creator_id) => {
    const response = await api.post('/admin/addroom', { email, name, creator_id });
    return response.data;
}
export const getroom = async () => {
    const response = await api.get('/admin/showrooms');
    return response.data;
};
export const deleteroom = async (room_id, email) => {
    const response = await api.delete(`/admin/deleteroom/${room_id}`, { email });
    return response.data;
};
export const editroom = async (room_id, name, email) => {

    const response = await api.put(`/admin/editroom/${room_id}`, { name, email });
    return response.data;
};
export const resetpass = async (email, password) => {
    const response = await api.put(`/admin/admin-reset`, { email, password });
    return response.data;
};
export const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
};
export const changepass = async (email, old_password, new_password, new_password_confirmation) => {
    const response = await api.post(`/admin/change-password`, { email, old_password, new_password, new_password_confirmation });
    return response.data;
};
export const changepassuser = async (email, old_password, new_password) => {
    const response = await api.post(`/change-password`, { email, old_password, new_password });
    return response.data;
};
export default api;
