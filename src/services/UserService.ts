import type { createUserType } from '../types/user'
import  api  from './api'

export async function postUser(userData: createUserType) {
  try {

    const response = await api.post('/users', userData)
    

    return response.data
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error)
    throw error
  }
}


export async function getUser() {
  try{
    const response = await api.get('/users')
    
    return response.data
  }catch(error){
    console.log("Erro ao procurar usuario", error)
    throw error
  }
}