import axios from 'axios'

const DEFAULT_API_URL = (['localhost', '127.0.0.1'].includes(window.location.hostname))
  ? 'http://localhost:5000/api'
  : '/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL

export const resolveImageUrl = (path) => {
  if (!path) return ''
  if (/^https?:\/\//.test(path) || path.startsWith('data:')) return path
  if (path.startsWith('/uploads/')) {
    return `${API_BASE_URL.replace(/\/api$/, '')}${path}`
  }
  return path
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = String(error.config?.url || '').includes('/auth/login')
    const hadToken = !!localStorage.getItem('token')
    if (error.response?.status === 401 && hadToken && !isLoginRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
}

export const consultationAPI = {
  create: (data) => api.post('/consultations', data),
  getAll: (params) => api.get('/consultations', { params }),
  getById: (id) => api.get(`/consultations/${id}`),
  updateStatus: (id, status) => api.patch(`/consultations/${id}/status`, { status }),
  updateNotes: (id, adminNotes) => api.patch(`/consultations/${id}/notes`, { adminNotes }),
  delete: (id) => api.delete(`/consultations/${id}`)
}

export const projectAPI = {
  getPublic: (params) => api.get('/projects', { params }),
  getBySlug: (slug) => api.get(`/projects/${slug}`),
  getAll: (params) => api.get('/projects/admin/all', { params }),
  getById: (id) => api.get(`/projects/admin/${id}`),
  create: (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key === 'services' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]))
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })
    return api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  update: (id, data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key === 'services' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]))
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })
    return api.patch(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  delete: (id) => api.delete(`/projects/${id}`),
  togglePublish: (id) => api.patch(`/projects/${id}/publish`)
}

export const articleAPI = {
  getPublic: (params) => api.get('/articles', { params }),
  getBySlug: (slug) => api.get(`/articles/${slug}`),
  getAll: (params) => api.get('/articles/admin/all', { params }),
  getById: (id) => api.get(`/articles/admin/${id}`),
  create: (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })
    return api.post('/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  update: (id, data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })
    return api.patch(`/articles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  delete: (id) => api.delete(`/articles/${id}`),
  togglePublish: (id) => api.patch(`/articles/${id}/publish`)
}

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.patch(`/users/${id}`, data),
  changePassword: (id, data) => api.patch(`/users/${id}/password`, data),
  delete: (id) => api.delete(`/users/${id}`)
}

export const teamAPI = {
  getPublic: (params) => api.get('/team', { params }),
  getAll: (params) => api.get('/team/admin/all', { params }),
  getById: (id) => api.get(`/team/admin/${id}`),
  create: (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })
    return api.post('/team', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  update: (id, data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })
    return api.patch(`/team/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  delete: (id) => api.delete(`/team/${id}`),
  toggleActive: (id) => api.patch(`/team/${id}/active`),
  togglePublish: (id) => api.patch(`/team/${id}/publish`)
}

export const healthAPI = {
  check: () => api.get('/health')
}

export default api