import './styles.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import CreateEnvForm from './components/CreateEnvironment'
import EditEnvForm from './components/EditEnvForm'
import { ArchivedEnvironmentsModal } from './components/ArchivedEnvironmentsModal/ArchivedEnvironmentsModal'
import {
  archiveStatusEnvironment,
  createEnvironment,
  deleteEnvironment,
  editEnvironment,
} from '../../services/EnvironmentService'
import { getMe, listUserEnvironments } from '../../services/UserService'
import type {
  CreateEnvironmentType,
  UpdateEnvironmentType,
  UserEnvironmentsType,
} from '../../types/EnvironmentType'
import toast from 'react-hot-toast'
import { msgErro } from '../../utils/erro'

function Home() {
  const [environments, setEnvironments] = useState<UserEnvironmentsType[]>([])
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [archivedModalOpen, setArchivedModalOpen] = useState(false)
  const [editing, setEditing] = useState<UserEnvironmentsType | null>(null)
  const [deleting, setDeleting] = useState<UserEnvironmentsType | null>(null)

  useEffect(() => {
    async function loadEnvironments() {
      try {
        const user = await getMe()
        setCurrentUserId(user.id)
        const userEnvironments = await listUserEnvironments(user.id)
        setEnvironments(userEnvironments)
      } catch (error) {
        toast.error(msgErro(error))
      }
    }

    loadEnvironments()
  }, [])

  const activeEnvironments = environments.filter((env) => !env.archived)

  const myArchivedEnvironments = environments.filter(
    (env) => env.archived && env.owner === currentUserId
  )

  async function handleCreate(data: CreateEnvironmentType) {
    try {
      const created = await createEnvironment(data)
      setEnvironments((prev) => [...prev, created])
      setDialogOpen(false)
      toast.success('Ambiente criado com sucesso!')
    } catch (error) {
      toast.error(msgErro(error))
    }
  }

  async function handleUpdate(data: UpdateEnvironmentType) {
    if (!editing) return

    try {
      const updated = await editEnvironment(editing.id, data)
      setEnvironments((prev) =>
        prev.map((environment) => (environment.id === updated.id ? updated : environment))
      )
      setEditing(null)
      toast.success('Ambiente atualizado!')
    } catch (error) {
      toast.error(msgErro(error))
    }
  }

  async function handleToggleArchive(envId: number, archive: boolean) {
    try {
      await archiveStatusEnvironment(envId, archive)
      setEnvironments((prev) =>
        prev.map((env) => (env.id === envId ? { ...env, archived: archive } : env))
      )
      toast.success(archive ? 'Ambiente arquivado!' : 'Ambiente restaurado com sucesso!')
    } catch (error) {
      toast.error(msgErro(error))
    }
  }

  async function handleDelete(envId?: number) {
    const targetId = envId ?? deleting?.id
    if (!targetId) return

    try {
      await deleteEnvironment(targetId)
      setEnvironments((prev) => prev.filter((environment) => environment.id !== targetId))
      setDeleting(null)
      toast.success('Ambiente excluído definitivamente!')
    } catch (error) {
      toast.error(msgErro(error))
    }
  }

  return (
    <Container maxWidth='lg' className='homePage'>
      <Typography variant='h4'>Meus Ambientes</Typography>

      <Box className='homeBox'>
        <Box className='homeHeader' sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant='contained' onClick={() => setDialogOpen(true)}>
            Criar novo ambiente
          </Button>

          {myArchivedEnvironments.length > 0 && (
            <Button variant='outlined' onClick={() => setArchivedModalOpen(true)}>
              Ambientes Arquivados ({myArchivedEnvironments.length})
            </Button>
          )}
        </Box>

        {activeEnvironments.length === 0 ? (
          <Typography className='homeEmpty'>
            Nenhum ambiente ativo cadastrado ainda.
          </Typography>
        ) : (
          <Box className='environmentGrid'>
            {activeEnvironments.map((environment) => {
              const isOwner = environment.owner === currentUserId

              return (
                <Card key={environment.id} className='environmentCard' elevation={4}>
                  <CardActionArea component={Link} to={`/environment/${environment.id}`}>
                    <CardContent>
                      <Typography variant='h6' component='h2'>
                        {environment.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {environment.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>

                  <CardActions>
                    <Button size='small' onClick={() => setEditing(environment)}>
                      Editar
                    </Button>
                    {isOwner && (
                      <>
                        <Button
                          size='small'
                          color='warning'
                          onClick={() => handleToggleArchive(environment.id, true)}
                        >
                          Arquivar
                        </Button>
                      </>
                    )}
                  </CardActions>
                </Card>
              )
            })}
          </Box>
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth='xs'>
        <DialogContent>
          <CreateEnvForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>

      <Dialog open={editing !== null} onClose={() => setEditing(null)} fullWidth maxWidth='xs'>
        <DialogContent>
          {editing && (
            <EditEnvForm
              key={editing.id}
              environment={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onClose={() => setDeleting(null)} fullWidth maxWidth='xs'>
        <DialogTitle>Excluir ambiente?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            O ambiente "{deleting?.name}" será excluído. Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancelar</Button>
          <Button color='error' onClick={() => handleDelete()}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <ArchivedEnvironmentsModal
        open={archivedModalOpen}
        onClose={() => setArchivedModalOpen(false)}
        archivedEnvironments={myArchivedEnvironments}
        onRestore={(envId) => handleToggleArchive(envId, false)}
        onDelete={(envId) => handleDelete(envId)}
      />
    </Container>
  )
}

export default Home