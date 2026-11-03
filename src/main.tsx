import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import CreateUser from './pages/CreateUser/index'
import LoginUser from './pages/Login/index'
import KanbanDefault from './pages/Dashboard/index'
import Layout from './components/Layout'
import Home from './pages/Home'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LoginUser />} />
          <Route path="/cadastro" element={<CreateUser />} />
          <Route path="/home" element={<Home />} />
          <Route path="/workspace/:id" element={<KanbanDefault />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
