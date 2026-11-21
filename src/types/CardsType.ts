export type CardEnv = {
    id: number
    label: string
    column: string | number
    description?: string
    priority?: number
    progress?: number
    deadline?: Date
    users?: number[]
    done?: boolean
    archived?: boolean
    position?: number
}