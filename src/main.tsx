import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import KanbanDashboard from './pages/Dashboard/index'
import { CssBaseline } from '@mui/material'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline/>
      <KanbanDashboard/>
  </StrictMode>
)
