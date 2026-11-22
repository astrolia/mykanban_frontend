export type Task = {
  id: string
  content: string
}

export type Column = {
  id: string
  name: string
  tasks: Task[]
}

export type Workspace = {
  id: string
  name: string
  description: string
  priorities: string[]
  columns: Column[]
}

export type CreateWorkspaceType = {
  name: string
  description: string
}

export type UpdateWorkspaceType = {
  name: string
  description: string
  priorities: string[]
}