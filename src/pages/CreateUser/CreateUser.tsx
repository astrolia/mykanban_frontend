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
import toast from 'react-hot-toast'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

function CreateUser() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const emailInvalid = email.trim().length > 0 && !EMAIL_REGEX.test(email.trim())
  const passwordInvalid = password.length > 0 && password.length < MIN_PASSWORD_LENGTH

  async function sendUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!EMAIL_REGEX.test(email.trim())) {
      toast.error('Digite um e-mail válido.')
      return
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Senha divergente!')
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

      toast.success('Cadastro realizado!')
      navigate('/login')
    } catch (error) {
      toast.error('Erro ao realizar o cadastro.')
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
                error={emailInvalid}
                helperText={emailInvalid ? 'Digite um e-mail válido' : ' '}
                fullWidth
                required
              />

              <TextField
                label='Senha'
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordInvalid}
                helperText={
                  passwordInvalid
                    ? `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`
                    : `Use pelo menos ${MIN_PASSWORD_LENGTH} caracteres`
                }
                slotProps={{ htmlInput: { minLength: MIN_PASSWORD_LENGTH } }}
                fullWidth
                required
              />

              <TextField
                label='Confirme a senha'
                type='password'
                name='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                slotProps={{ htmlInput: { minLength: MIN_PASSWORD_LENGTH } }}
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