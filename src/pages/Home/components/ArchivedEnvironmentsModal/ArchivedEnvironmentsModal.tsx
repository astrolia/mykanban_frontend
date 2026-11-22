import { useState } from 'react'
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import RestoreIcon from '@mui/icons-material/Restore'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import type { UserEnvironmentsType } from '../../../../types/EnvironmentType'

interface ArchivedEnvironmentsModalProps {
  open: boolean
  onClose: () => void
  archivedEnvironments: UserEnvironmentsType[]
  onRestore: (envId: number) => Promise<void>
  onDelete: (envId: number) => Promise<void>
}

export function ArchivedEnvironmentsModal({
  open,
  onClose,
  archivedEnvironments,
  onRestore,
  onDelete,
}: ArchivedEnvironmentsModalProps) {
  const [expandedRow, setExpandedRow] = useState<UserEnvironmentsType | null>(null)
  const [confirmDeleteEnv, setConfirmDeleteEnv] = useState<UserEnvironmentsType | null>(null)

  const toggleExpand = (env: UserEnvironmentsType) => {
    setExpandedRow((prev) => (prev?.id === env.id ? null : env))
  }

  const columns: GridColDef<UserEnvironmentsType>[] = [
    {
      field: 'expand',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isExpanded = expandedRow?.id === params.row.id
        return (
          <Tooltip title={isExpanded ? 'Ocultar descrição' : 'Ver descrição'}>
            <IconButton size='small' onClick={() => toggleExpand(params.row)}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Tooltip>
        )
      },
    },
    {
      field: 'name',
      headerName: 'Nome do Ambiente',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <Tooltip title='Restaurar ambiente'>
            <IconButton
              size='small'
              color='primary'
              onClick={() => onRestore(params.row.id)}
            >
              <RestoreIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Excluir definitivamente'>
            <IconButton
              size='small'
              color='error'
              onClick={() => setConfirmDeleteEnv(params.row)}
            >
              <DeleteForeverIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  async function handleConfirmDelete() {
    if (!confirmDeleteEnv) return
    await onDelete(confirmDeleteEnv.id)
    if (expandedRow?.id === confirmDeleteEnv.id) {
      setExpandedRow(null)
    }
    setConfirmDeleteEnv(null)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
        <DialogTitle>Ambientes Arquivados</DialogTitle>
        <DialogContent>
          {archivedEnvironments.length === 0 ? (
            <Typography color='text.secondary' sx={{ py: 3, textAlign: 'center' }}>
              Nenhum ambiente arquivado disponível.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Box sx={{ height: 350, width: '100%' }}>
                <DataGrid
                  rows={archivedEnvironments}
                  columns={columns}
                  pageSizeOptions={[5, 10]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  disableRowSelectionOnClick
                />
              </Box>

              <Collapse in={expandedRow !== null}>
                {expandedRow && (
                  <Paper variant='outlined' sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant='subtitle2' color='primary' gutterBottom>
                      Detalhes de: {expandedRow.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      <strong>Descrição:</strong>{' '}
                      {expandedRow.description || 'Sem descrição cadastrada.'}
                    </Typography>
                  </Paper>
                )}
              </Collapse>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteEnv !== null}
        onClose={() => setConfirmDeleteEnv(null)}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle>Excluir definitivamente?</DialogTitle>
        <DialogContent>
          <Typography variant='body2'>
            Tem certeza que deseja excluir o ambiente{' '}
            <strong>"{confirmDeleteEnv?.name}"</strong>? Essa ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteEnv(null)}>Cancelar</Button>
          <Button color='error' variant='contained' onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}