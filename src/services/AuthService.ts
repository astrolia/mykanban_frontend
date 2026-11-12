import api from './api'

export async function login(email: string, password: string) {
  const response = await api.post<{ token: string }>('/auth/login', { email, password })
  localStorage.setItem('token', response.data.token)
  return response.data
}

export function logout() {
  localStorage.removeItem('token')
}

export function isAuthenticated() {
  return !!localStorage.getItem('token')
}