import axios from 'axios'
import { API_URL } from '../config'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

let authToken = null
export function setAuthToken(token) {
  authToken = token || null
}

// Attach the JWT to every request when the user is signed in.
api.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`
  return config
})

// Turn any axios error into a readable message for the UI.
export function getErrorMessage(error) {
  if (error?.response) {
    return error.response.data?.message || `Request failed (${error.response.status})`
  }
  if (error?.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.'
  }
  if (error?.request) {
    return `Cannot reach the server (${API_URL}). Check that the backend is running and the API URL is correct.`
  }
  return error?.message || 'Something went wrong.'
}

export const productsApi = {
  list: () => api.get('/products').then((r) => r.data),
  get: (id) => api.get(`/products/${id}`).then((r) => r.data),
  create: (data) => api.post('/products', data).then((r) => r.data),
  update: (id, data) => api.put(`/products/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
}

export const ordersApi = { mine: () => api.get('/orders/mine').then(r=>r.data), list: () => api.get('/orders').then(r=>r.data), create: (items) => api.post('/orders',{items}).then(r=>r.data), ship: (id) => api.patch(`/orders/${id}/ship`).then(r=>r.data) }
export const customersApi = { list: () => api.get('/customers').then(r=>r.data) }

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }).then((r) => r.data),
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }).then((r) => r.data),
}

export default api
