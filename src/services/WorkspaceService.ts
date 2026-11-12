import type {
  Column,
  CreateWorkspaceType,
  Task,
  UpdateWorkspaceType,
  Workspace,
} from '../types/workspace'

function defaultColumns(): Column[] {
  return [
    { id: crypto.randomUUID(), name: 'To Do', tasks: [] },
    { id: crypto.randomUUID(), name: 'In Progress', tasks: [] },
    { id: crypto.randomUUID(), name: 'Done', tasks: [] },
  ]
}

let workspaces: Workspace[] = [
  {
    id: '1',
    name: 'Primeiro ambiente',
    description: 'Default',
    priorities: ['Alta', 'Média', 'Baixa'],
    columns: defaultColumns(),
  },
]

function changeWorkspace(id: string, change: (ws: Workspace) => Workspace): Workspace {
  const current = workspaces.find((ws) => ws.id === id)
  if (!current) throw new Error('Ambiente não encontrado')

  const updated = change(current)
  workspaces = workspaces.map((ws) => (ws.id === id ? updated : ws))
  return updated
}


export async function listWorkspaces(): Promise<Workspace[]> {
  return [...workspaces]
}

export async function getWorkspace(id: string): Promise<Workspace | undefined> {
  return workspaces.find((ws) => ws.id === id)
}

export async function createWorkspace(data: CreateWorkspaceType): Promise<Workspace> {
  const workspace: Workspace = {
    id: crypto.randomUUID(),
    priorities: [],
    columns: defaultColumns(),
    ...data,
  }
  workspaces = [...workspaces, workspace]
  return workspace
}

export async function updateWorkspace(
  id: string,
  data: UpdateWorkspaceType
): Promise<Workspace> {
  return changeWorkspace(id, (ws) => ({ ...ws, ...data }))
}

export async function deleteWorkspace(id: string): Promise<void> {
  workspaces = workspaces.filter((ws) => ws.id !== id)
}


export async function addTask(
  workspaceId: string,
  columnId: string,
  content: string
): Promise<Task> {
  const task: Task = { id: crypto.randomUUID(), content }

  changeWorkspace(workspaceId, (ws) => ({
    ...ws,
    columns: ws.columns.map((col) =>
      col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
    ),
  }))

  return task
}

export async function removeTask(
  workspaceId: string,
  columnId: string,
  taskId: string
): Promise<void> {
  changeWorkspace(workspaceId, (ws) => ({
    ...ws,
    columns: ws.columns.map((col) =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
        : col
    ),
  }))
}

export async function moveTask(
  workspaceId: string,
  taskId: string,
  fromColumnId: string,
  toColumnId: string
): Promise<void> {
  changeWorkspace(workspaceId, (ws) => {
    const task = ws.columns
      .find((col) => col.id === fromColumnId)
      ?.tasks.find((t) => t.id === taskId)

    if (!task) throw new Error('Tarefa não encontrada')

    return {
      ...ws,
      columns: ws.columns.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
        }
        if (col.id === toColumnId) {
          return { ...col, tasks: [...col.tasks, task] }
        }
        return col
      }),
    }
  })
}


export async function addColumn(workspaceId: string): Promise<Column> {
  const column: Column = { id: crypto.randomUUID(), name: 'Nova Coluna', tasks: [] }

  changeWorkspace(workspaceId, (ws) => ({
    ...ws,
    columns: [...ws.columns, column],
  }))

  return column
}

export async function renameColumn(
  workspaceId: string,
  columnId: string,
  name: string
): Promise<void> {
  changeWorkspace(workspaceId, (ws) => ({
    ...ws,
    columns: ws.columns.map((col) => (col.id === columnId ? { ...col, name } : col)),
  }))
}

export async function removeColumn(workspaceId: string, columnId: string): Promise<void> {
  changeWorkspace(workspaceId, (ws) => ({
    ...ws,
    columns: ws.columns.filter((col) => col.id !== columnId),
  }))
}