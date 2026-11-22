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

export type ColumnCreateType = {
    label: string
    position?: number
}

export type ColumnEnv = {
    id: number
    label: string
    position?: number
}

export type CardEnv = {
    id: number
    label: string
    column: number
    description?: string
    priority?: number
    progress?: number
    deadline?: Date
    users?: number[]
    done?: boolean
    archived?: boolean
    position?: number
}

export type PriorityEnv = {
    id: number
    label: string
    css: string
}

export type userEnv = {
    id: number
    label: string
}