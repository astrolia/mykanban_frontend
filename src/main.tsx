import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CreateUser from './pages/CreateUser/index'
import KanbanDefault from './pages/Dashboard/index'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KanbanDefault />
  </StrictMode>,
)
