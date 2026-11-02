import './styles.css'

import {useState} from 'react'


type Task = { id: string; content: string }
type Column = { name: string; items: Task[] }
type Columns = Record<string, Column>
type Dragged = { columnId: string; item: Task }

function KanbanDefault() {
  const [columns, setColumns] = useState<Columns>({
    todo: { name: "To Do", items: [] },
    inProgress: { name: "In Progress", items: [] },
    done: { name: "Done", items: [] },
  });



  const [newTask, setNewTask] = useState("")
  const [activeColumns, setActiveColumn] = useState("todo")
  const [draggedItem, setDraggedItem] = useState<Dragged | null>(null)

   

  const addNewTask = () => {
    if(newTask.trim() === "") return;

    setColumns((prev) => ({
      ...prev,
      [activeColumns]:{
        ...prev[activeColumns],
        items:[
          ...prev[activeColumns].items,
          {id: Date.now().toString(), content: newTask},//fazer func pra pegar o id dado pelo banco
        ]
      }
    }))
    setNewTask("")
  };

  const removeTask = (columnId: string, taskId: string) => {

    setColumns((prev) => ({
      ...prev, 
      [columnId]:{
        ...prev[columnId],
        items:[
          ...prev[columnId].items.filter((item) => item.id !== taskId)
        ]
      }
    }))
  }

  const handleDragStart = (columnId: string, item: Task) => {
    setDraggedItem({ columnId, item })
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
      e.preventDefault();

      if(!draggedItem) return;

      const {columnId: sourceColumnId, item} = draggedItem;

      if(sourceColumnId ===  targetColumnId) return;


      setColumns((prev) => ({
      ...prev,
      [sourceColumnId]: {
        ...prev[sourceColumnId],
        items: prev[sourceColumnId].items.filter((i) => i.id !== item.id),
      },
      [targetColumnId]: {
        ...prev[targetColumnId],
        items: [...prev[targetColumnId].items, item],
      },
    }))

    setDraggedItem(null)

  }



  return (
  <div className="mainDiv">

    <div className="addTask">
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addNewTask()}
        placeholder="Nova tarefa..."
      />
      <select value={activeColumns} onChange={(e) => setActiveColumn(e.target.value)}>
        {Object.entries(columns).map(([id, col]) => (
          <option key={id} value={id}>{col.name}</option>
        ))}
      </select>
      <button className="btnAdd" onClick={addNewTask}>Adicionar</button>
    </div>

    <div className="board">
      {Object.entries(columns).map(([columnId, column]) => (
        <div
          key={columnId}
          className="column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, columnId)}
        >
          <div className="columnHeader">
            <h3>{column.name}</h3>
            <span className="badge">{column.items.length}</span>
          </div>

          <div className="taskList">
            {column.items.length === 0 && (
              <p className="empty">Sem tarefas</p>
            )}

            {column.items.map((task) => (
              <div
                key={task.id}
                className="task"
                draggable
                onDragStart={() => handleDragStart(columnId, task)}
              >
                <span>{task.content}</span>
                <button
                  className="btnRemove"
                  aria-label="Remover tarefa"
                  onClick={() => removeTask(columnId, task.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default KanbanDefault
