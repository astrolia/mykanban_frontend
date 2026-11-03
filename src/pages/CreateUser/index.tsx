import './styles.css'
import { postUser } from '../../services/UserService'
import { useNavigate } from 'react-router-dom'

import { useState } from 'react'

function CreateUser() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()


async function sendUser(e: SubmitEvent) {
    e.preventDefault()

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    if (password !== confirmPassword) {
      alert("Senha divergente!")
      return
    }

    try {
      const newUser = { name, email, password }

      const result = await postUser(newUser)
      navigate('/')

      console.log("Usuário cadastrado com sucesso!", result)
      alert("Cadastro realizado!")
    } catch (error) {
      alert("Erro ao realizar o cadastro.")
    }
  }


  return (<div className='mainDiv'>
      <form onSubmit={(e) => sendUser(e as unknown as SubmitEvent)}>
        <h2>Informe seus dados</h2>
        <label>Nome:</label>
        <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)}/>
        <label>Email:</label>
        <input type="text" name='email'value={email} onChange={(e) => setEmail(e.target.value)}/>
        <label>Senha:</label>
        <input type="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        <label>Confirme a senha:</label>
        <input type="password" name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>

        <button type='submit'>Confirmar</button>
      </form>
    </div>
  )
}

export default CreateUser
