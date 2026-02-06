import axios from 'axios';

const API_URL = 'https://threew-backend-g9hi.onrender.com';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data)
};

export const postAPI = {
    createPost: (formData) => api.post('/posts/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAllPosts: () => api.get('/posts'),
    likePost: (postId) => api.post(`/posts/${postId}/like`),
    commentPost: (postId, data) => api.post(`/posts/${postId}/comment`, data),
    updatePost: (postId, formData) => api.put(`/posts/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deletePost: (postId) => api.delete(`/posts/${postId}`)
};

export default api;
