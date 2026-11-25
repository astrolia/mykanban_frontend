import type {
    EnvironmentResponseType,
    CreateEnvironmentType,
    UpdateEnvironmentType,
    UserEnvironmentsType,
} from '../types/EnvironmentType'
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

export async function archiveStatusEnvironment(envId: number, archive: boolean){
        const response = await api.patch(`/environment/${envId}/archive-status`, { archived: archive })
        return response.data
}

export async function createEnvironment(env: CreateEnvironmentType): Promise<UserEnvironmentsType>{
        const response = await api.post<UserEnvironmentsType>(`/environment/create`, env)
        return response.data
}

export async function editEnvironment(envId: number, env: UpdateEnvironmentType): Promise<UserEnvironmentsType>{
        const response = await api.patch<UserEnvironmentsType>(`/environment/${envId}`, env)
        return response.data
}

export async function deleteEnvironment(envId: number){
        const response = await api.delete(`/environment/${envId}`)
        return response.data
}