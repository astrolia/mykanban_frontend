import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import './index.css'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import CreateUser from './pages/CreateUser/CreateUser'
import KanbanEnvironment from './pages/Environment/Environment'
import UserSettings from './pages/UserSettings/UserSettings'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import { CssBaseline } from '@mui/material'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ptBR } from 'date-fns/locale'
import { Toaster } from 'react-hot-toast'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      contrastText: '#121212',
    },
    secondary: {
      main: '#788ba8',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
    divider: '#333333',
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Toaster position="top-right" />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<CreateUser />} />
              <Route element={<PrivateRoute><Outlet /></PrivateRoute>}>
                <Route path="/home" element={<Home />} />
                <Route path="/environment/:envId" element={<KanbanEnvironment />} />
                <Route path="/configuracoes" element={<UserSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </LocalizationProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)