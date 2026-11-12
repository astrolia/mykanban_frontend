import type {
  createUserType,
  UserResponseType,
  UpdateUserType,
  ChangePasswordType,
} from '../types/user'
import api from './api'

export async function postUser(userData: createUserType) {
  try {
    const response = await api.post('/users', userData)
    return response.data
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error)
    throw error
  }
}

export async function getMe(): Promise<UserResponseType> {
  const response = await api.get<UserResponseType>('/users/me')
  return response.data
}

export async function updateMe(data: UpdateUserType): Promise<UserResponseType> {
  const response = await api.put<{ user: UserResponseType; token: string }>('/users/me', data)
  localStorage.setItem('token', response.data.token)
  return response.data.user
}

export async function changePassword(data: ChangePasswordType) {
  await api.put('/users/me/password', data)
}

export async function deleteMe(password: string) {
  await api.delete('/users/me', { data: { password } })
  localStorage.removeItem('token')
}