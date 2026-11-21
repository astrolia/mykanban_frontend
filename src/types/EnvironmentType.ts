


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