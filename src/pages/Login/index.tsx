import './styles.css'
import { getUser } from '../../services/UserService'
import { useNavigate } from 'react-router-dom'

import { useState } from 'react'

function LoginUser() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()


 async function loginUser(e: SubmitEvent) {
    e.preventDefault()

    try {
      const user = await getUser()
      console.log(user)

      setEmail('')
      setPassword('')
    } catch (error) {
      setPassword('')
      alert('Email ou senha inválidos')
    }
  }


  return (<div className='mainDiv'>
      <form onSubmit={(e) => loginUser(e as unknown as SubmitEvent)}>
        <h3>Entre com seus dados:</h3>
        <label>Email:</label>
        <input type="text" name='email'value={email} onChange={(e) => setEmail(e.target.value)}/>
        <label>Senha:</label>
        <input type="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type='submit'>Confirmar</button>
        <p>Ou</p>
        <button type="button" onClick={() => navigate('/cadastro')}>Cadastre-se</button>
      </form>
    </div>
  )
}

export default LoginUser
