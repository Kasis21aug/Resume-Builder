import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Auto-attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Map Supabase snake_case → camelCase for the frontend
const mapResume = (r) => {
  if (!r || typeof r !== 'object') return r;
  return {
    _id:          r.id           ?? r._id,
    id:           r.id           ?? r._id,
    userId:       r.user_id      ?? r.userId,
    title:        r.title,
    templateId:   r.template_id  ?? r.templateId  ?? 'classic',
    personalInfo: r.personal_info ?? r.personalInfo ?? {},
    experience:   r.experience   ?? [],
    education:    r.education    ?? [],
    skills:       r.skills       ?? [],
    createdAt:    r.created_at   ?? r.createdAt,
    updatedAt:    r.updated_at   ?? r.updatedAt,
  };
};

api.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (Array.isArray(data)) {
      response.data = data.map(mapResume);
    } else if (data && (data.template_id !== undefined || data.personal_info !== undefined)) {
      response.data = mapResume(data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
