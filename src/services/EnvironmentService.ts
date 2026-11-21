import type { EnvironmentType} from '../types/EnvironmentType'
import api from './api'



export async function loadEnvironment(): Promise<EnvironmentType>{
    try{
        const response = await api.get<EnvironmentType>('/environment')
        return response.data
    }catch(erro){
        throw new Error("Falha ao retornar ambiente");
    }
}

export async function addUserEnvironment(envId: number, userId: number){
    try{
        const response = await api.patch(`/environment/${envId}/users/${userId}`)
        return response.data
    }catch(e){
        throw new Error("Falha ao retornar ambiente");
    }
}