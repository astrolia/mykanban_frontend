import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import KanbanDashboard from './pages/Environment/index'
import { CssBaseline } from '@mui/material'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline/>

    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <KanbanDashboard/>
  </LocalizationProvider>
      <KanbanDashboard/>
  </StrictMode>
)
