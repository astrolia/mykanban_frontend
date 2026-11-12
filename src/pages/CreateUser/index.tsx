import { postUser } from '../../services/UserService'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { useState } from 'react'
import type { FormEvent } from 'react'

function CreateUser() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  async function sendUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Senha divergente!')
      return
    }

    try {
      const newUser = { name, email, password }

      const result = await postUser(newUser)
      console.log('Usuário cadastrado com sucesso!', result)

      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      alert('Cadastro realizado!')
      navigate('/login')
    } catch (error) {
      alert('Erro ao realizar o cadastro.')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box component='form' onSubmit={sendUser}>
            <Stack spacing={2.5}>
              <Typography variant='h5'>
                Informe seus dados
              </Typography>

              <TextField
                label='Nome'
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label='Email'
                type='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label='Senha'
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label='Confirme a senha'
                type='password'
                name='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
              />

              <Button type='submit' variant='contained' size='large' fullWidth>
                Confirmar
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CreateUser