import './styles.css'
import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <NavLink to="/" className="logo">MyKanban</NavLink>

      <nav className="nav">
        <NavLink to="/" end>Login</NavLink>
        <NavLink to="/cadastro">Cadastro</NavLink>
        <NavLink to="/home">Home</NavLink>
      </nav>
    </header>
  )
}

export default Header