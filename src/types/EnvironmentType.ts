
import type { PriorityEnv } from "./PriorityType"
import type { CardEnv } from "./CardsType"
import type { ColumnEnv } from "./ColumnsType"
import type { userEnv } from "./UserType"

export type EnvironmentType = {
  id: number 
  name: string
  description: string
  owner: number
  priority: PriorityEnv[]
  columns: ColumnEnv[]
  cards: CardEnv[]
  users: userEnv[]
  archive: CardEnv[]
}

export type EnvironmentResponseType = {
  id: number
  name: string
  description: string
  owner: number
  archived: boolean
  priority: PriorityEnv[]
  columns: ColumnEnv[]
  cards: CardEnv[]
  users: userEnv[]
}

export type UserEnvironmentsType = {
  id: number
  name: string
  description: string
  owner: number
  archived: boolean
}

export type CreateEnvironmentType = Pick<UserEnvironmentsType, 'name' | 'description'>

export type UpdateEnvironmentType = Partial<CreateEnvironmentType>