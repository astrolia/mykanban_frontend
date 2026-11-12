import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  changePassword,
  deleteMe,
  getMe,
  updateMe,
} from '../../services/UserService'

type Feedback = { type: 'success' | 'error'; text: string } | null

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? fallback
  }
  return fallback
}

function Settings() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileFeedback, setProfileFeedback] = useState<Feedback>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>(null)


  const [dialogOpen, setDialogOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    getMe()
      .then((user) => {
        setName(user.name)
        setEmail(user.email)
      })
      .catch(() =>
        setProfileFeedback({ type: 'error', text: 'Erro ao carregar seus dados' })
      )
  }, [])

  async function handleProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProfileFeedback(null)

    try {
      const user = await updateMe({ name, email })
      setName(user.name)
      setEmail(user.email)
      setProfileFeedback({ type: 'success', text: 'Dados atualizados com sucesso' })
    } catch (error) {
      setProfileFeedback({
        type: 'error',
        text: getErrorMessage(error, 'Erro ao atualizar os dados'),
      })
    }
  }

  async function handlePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPasswordFeedback(null)

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', text: 'As senhas novas não são iguais' })
      return
    }

    try {
      await changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordFeedback({ type: 'success', text: 'Senha alterada com sucesso' })
    } catch (error) {
      setPasswordFeedback({
        type: 'error',
        text: getErrorMessage(error, 'Erro ao alterar a senha'),
      })
    }
  }

  function closeDialog() {
    setDialogOpen(false)
    setDeletePassword('')
    setDeleteError('')
  }

  async function handleDelete() {
    setDeleteError('')

    try {
      await deleteMe(deletePassword)
      navigate('/login', { replace: true })
    } catch (error) {
      setDeleteError(getErrorMessage(error, 'Erro ao excluir a conta'))
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 500 }}>
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box component='form' onSubmit={handleProfile}>
              <Stack spacing={2.5}>
                <Typography variant='h6'>Dados da conta</Typography>

                <TextField
                  label='Nome'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label='Email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />

                {profileFeedback && (
                  <Alert severity={profileFeedback.type}>{profileFeedback.text}</Alert>
                )}

                <Button type='submit' variant='contained'>
                  Salvar alterações
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box component='form' onSubmit={handlePassword}>
              <Stack spacing={2.5}>
                <Typography variant='h6'>Alterar senha</Typography>

                <TextField
                  label='Senha atual'
                  type='password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete='current-password'
                  fullWidth
                  required
                />
                <TextField
                  label='Nova senha'
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete='new-password'
                  helperText='Mínimo de 6 caracteres'
                  fullWidth
                  required
                />
                <TextField
                  label='Confirmar nova senha'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete='new-password'
                  fullWidth
                  required
                />

                {passwordFeedback && (
                  <Alert severity={passwordFeedback.type}>{passwordFeedback.text}</Alert>
                )}

                <Button type='submit' variant='contained'>
                  Alterar senha
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={2}>
              <Typography variant='h6'>Excluir conta</Typography>
              <Typography variant='body2'>
                Ao excluir sua conta, todos os seus dados e ambientes serão apagados.
                Essa ação não pode ser desfeita.
              </Typography>
              <Button color='error' variant='outlined' onClick={() => setDialogOpen(true)}>
                Excluir minha conta
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth='xs'>
        <DialogTitle>Excluir conta?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Digite sua senha para confirmar a exclusão.
          </DialogContentText>
          <TextField
            label='Senha'
            type='password'
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            autoComplete='current-password'
            fullWidth
            autoFocus
          />
          {deleteError && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancelar</Button>
          <Button color='error' onClick={handleDelete} disabled={!deletePassword}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Settings