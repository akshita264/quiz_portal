import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://quizbackend-production-aaf3.up.railway.app/owasp-quiz',
  withCredentials: true, 
});

// Add Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication Functions
export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Quiz Functions
export const checkAccess = async (quizId) => {
  try {
    const response = await api.post('/instructions', { quizId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQuestions = async (quizId) => {
  try {
    const response = await api.post(`/quizzes/${quizId}/start`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitAnswers = async (sessionId, answers) => {
  try {
    const response = await api.post(`/sessions/${sessionId}/submit`, { answers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
