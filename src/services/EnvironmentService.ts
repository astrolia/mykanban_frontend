import type { EnvironmentType, EnvironmentResponseType} from '../types/EnvironmentType'
import type { userEnv } from '../types/UserType';
import api from './api'



export async function loadEnvironment(envId: number): Promise<EnvironmentResponseType> {
    const response = await api.get<EnvironmentResponseType>(`/environment/${envId}`)
    return response.data
}

export async function addUserEnvironment(envId: number, userId: number): Promise<userEnv>{
        const response = await api.patch(`/environment/${envId}/users`, {userId})
        return response.data
}

export async function deleteUserEnvironment(envId: number, userId: number){
        const response = await api.delete(`/environment/${envId}/users`,  { data: { userId } })
        return response.data
}