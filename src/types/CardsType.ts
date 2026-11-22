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
  column?: CardEnv["column"];     // coluna de destino; omitida se só reordenou dentro da mesma coluna
  before?: CardEnv["id"] | null;  // id do card que fica logo depois; null (ou omitido) = fim da coluna
};