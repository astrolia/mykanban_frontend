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

export type CardMoveType = {
  column?: CardEnv["column"];
  before?: CardEnv["id"] | null;
};