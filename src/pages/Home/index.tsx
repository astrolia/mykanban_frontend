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
import type { CreateEnvData } from './components/CreateEnvironment'
import EditEnvForm from './components/EditEnvForm' 
import {
  createWorkspace,
  deleteWorkspace,
  listWorkspaces,
  updateWorkspace,
} from '../../services/REMOVERWorkspaceService'
import type { UpdateWorkspaceType, Workspace } from '../../types/REMOVERworkspace'

function Home() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Workspace | null>(null)
  const [deleting, setDeleting] = useState<Workspace | null>(null)

  useEffect(() => {
    listWorkspaces().then(setWorkspaces)
  }, [])

  async function handleCreate(data: CreateEnvData) {
    try {
      const created = await createWorkspace(data)
      setWorkspaces((prev) => [...prev, created])
      setDialogOpen(false)
    } catch (error) {
      alert('Erro ao criar o ambiente')
    }
  }

  async function handleUpdate(data: UpdateWorkspaceType) {
    if (!editing) return

    try {
      const updated = await updateWorkspace(editing.id, data)
      setWorkspaces((prev) => prev.map((ws) => (ws.id === updated.id ? updated : ws)))
      setEditing(null)
    } catch (error) {
      alert('Erro ao editar o ambiente')
    }
  }

  async function handleDelete() {
    if (!deleting) return

    try {
      await deleteWorkspace(deleting.id)
      setWorkspaces((prev) => prev.filter((ws) => ws.id !== deleting.id))
      setDeleting(null)
    } catch (error) {
      alert('Erro ao excluir o ambiente')
    }
  }

  return (
    <Container maxWidth='lg' className='homePage'>
      <Typography variant='h4'>Meus Ambientes</Typography>

      <Box className='homeBox'>
        <Box className='homeHeader'>
          <Button variant='contained' onClick={() => setDialogOpen(true)}>
            Criar novo ambiente
          </Button>
        </Box>

        {workspaces.length === 0 ? (
          <Typography className='homeEmpty'>
            Nenhum workspace cadastrado ainda.
          </Typography>
        ) : (
          <Box className='workspaceGrid'>
            {workspaces.map((ws) => (
              <Card key={ws.id} className='workspaceCard' elevation={4}>
                <CardActionArea component={Link} to={`/workspace/${ws.id}`}>
                  <CardContent>
                    <Typography variant='h6' component='h2'>
                      {ws.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {ws.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>

                <CardActions>
                  <Button size='small' onClick={() => setEditing(ws)}>
                    Editar
                  </Button>
                  <Button size='small' color='error' onClick={() => setDeleting(ws)}>
                    Excluir
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* criar */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth='xs'>
        <DialogContent>
          <CreateEnvForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>

      {/* editar */}
      <Dialog open={editing !== null} onClose={() => setEditing(null)} fullWidth maxWidth='xs'>
        <DialogContent>
          {editing && (
            <EditEnvForm
              key={editing.id}
              workspace={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* confirmar exclusão */}
      <Dialog open={deleting !== null} onClose={() => setDeleting(null)} fullWidth maxWidth='xs'>
        <DialogTitle>Excluir ambiente?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            O ambiente "{deleting?.name}" será excluído. Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancelar</Button>
          <Button color='error' onClick={handleDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Home