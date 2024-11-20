
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
export const deleteroom = async (selectedUser) => {
    const response = await api.delete(`/admin/deleteuser/${selectedUser}`);
    return response.data;
};
export const editroom = async (id, name) => {
    const response = await api.put(`/admin/editroom/${id}`, { name });
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
};

export default api;
