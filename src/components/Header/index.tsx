import './styles.css'
import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, MenuItem, Divider } from '@mui/material'
import { isAuthenticated, logout } from '../../services/AuthService'

function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  function closeMenu() {
    setAnchorEl(null)
  }

  function handleSettings() {
    closeMenu()
    navigate('/configuracoes')
  }

  function handleLogout() {
    closeMenu()
    logout()
    navigate('/login', { replace: true })
  }

  function renderLinks() {
    if (pathname === '/login') {
      return <NavLink to="/cadastro">Cadastro</NavLink>
    }

    if (pathname === '/cadastro') {
      return <NavLink to="/login">Login</NavLink>
    }

    return (
      <>
        <NavLink to={'/home'}>Home</NavLink>
        <button
          type="button"
          className="settingsBtn"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-haspopup="true"
          aria-expanded={open}
        >
          ⚙ Conta
        </button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleSettings}>Configurações</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>Sair</MenuItem>
        </Menu>
      </>
    )
  }

  return (
    <header className="header">
      <NavLink to={isAuthenticated() ? '/home' : '/login'} className="logo">
        MyKanban
      </NavLink>

      <nav className="nav">{renderLinks()}</nav>
    </header>
  )
}

export default Header