import type { EnvironmentType, ColumnEnv, ColumnCreateType } from '../types/REMOVERenvironment'
import api from './api'



export async function loadEnvironment(): Promise<EnvironmentType>{
    try{
        const response = await api.get<EnvironmentType>('/environment')
        return response.data
    }catch(erro){
        throw new Error("Falha ao retornar ambiente");
    }
}


export async function createColumn(column: ColumnCreateType): Promise<ColumnEnv>{
    try{
        const response = await api.post<ColumnEnv>('/environment/column', column)
        return response.data
    }catch(e){
        throw new Error("Falha ao retornar ambiente");
    }
}


export async function deleteColumn(id: number){
    try{
        const response = await api.delete(`/environment/column/id=${id}`)
        return response
    }catch(e){
        throw new Error("Falha ao retornar ambiente");
    }
}

export async function editColumn(column: ColumnEnv){

    const id = column.id;
    const label = column.label
    try{
        const response = await api.patch(`/environment/column/id=${id}`, label)
        return response
    }catch(e){
        throw new Error("Falha ao retornar ambiente");
    }
}
