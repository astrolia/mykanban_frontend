
import type { PriorityEnv } from "./PriorityType"
import type { CardEnv } from "./CardsType"
import type { ColumnEnv } from "./ColumnsType"
import type { userEnv } from "./UserType"

export type EnvironmentType = {
  id: number
  name: string
  description: string
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