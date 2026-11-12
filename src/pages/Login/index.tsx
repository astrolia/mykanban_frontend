import './styles.css'
import { login } from '../../services/AuthService'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { useState } from 'react'
import type { FormEvent } from 'react'

function LoginUser() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

async function loginUser(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()

  try {
    await login(email, password)
    navigate('/home')
  } catch (error) {
    setPassword('')
    alert('Email ou senha inválidos')
  }
}

  return (
    <Box
      className='mainDiv'
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 500, borderRadius: 4}}>
        <CardContent sx={{ p: 4 }}>
          <Box component='form' onSubmit={loginUser}>
            <Stack spacing={2.5}>
              <Typography variant='h5'>
                Entre com seus dados
              </Typography>

              <TextField
                label='Email'
                type='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete='email'
                fullWidth
                required
              />

              <TextField
                label='Senha'
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='current-password'
                fullWidth
                required
              />

              <Button type='submit' variant='contained' size='large' fullWidth>
                Confirmar
              </Button>

              <Divider>Ou</Divider>

              <Button
                type='button'
                variant='outlined'
                size='large'
                fullWidth
                onClick={() => navigate('/cadastro')}
              >
                Cadastre-se
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginUser