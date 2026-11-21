import { useMemo, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, IconButton, LinearProgress, Stack, Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales'; // exige @mui/x-data-grid v6 ou superior
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrashOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForeverOutlined';
// ajuste o caminho conforme a pasta onde o componente ficar
import type {CardEnv, ColumnEnv, PriorityEnv, userEnv} from "/home/leviatan/Documents/Workspace/Projetos_Faculdade/kanban_front2/mykanban/src/types/environment"

import './priorities.css'; // classes das cores de prioridade (ajuste o caminho)

// Mesma constante do KanbanCardContent (100 se o progresso for 0-100, 1 se for 0-1)
const PROGRESS_MAX = 100;

type Props = {
  open: boolean;
  onClose: () => void;
  archive: CardEnv[];
  columns: ColumnEnv[];
  priorities: PriorityEnv[];
  users: userEnv[];
  onRestore: (card: CardEnv) => void;
  onDeleteForever: (card: CardEnv) => void;
};

function ArchiveDialog({
  open, onClose, archive, columns, priorities, users, onRestore, onDeleteForever,
}: Props) {
  const [expanded, setExpanded] = useState<Set<CardEnv['id']>>(new Set());
  const [deleting, setDeleting] = useState<CardEnv | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggle = (id: CardEnv['id']) =>
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const askDelete = (card: CardEnv) => {
    setDeleting(card);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleting) onDeleteForever(deleting);
    setConfirmOpen(false);
  };

  const noColumns = columns.length === 0;

  const gridColumns = useMemo<GridColDef<CardEnv>[]>(() => [
    {
      field: 'expand',
      headerName: '',
      width: 56,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: params => {
        const isOpen = expanded.has(params.row.id);
        return (
          <IconButton
            size="small"
            aria-label={isOpen ? 'Recolher detalhes' : 'Expandir detalhes'}
            onClick={() => toggle(params.row.id)}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        );
      },
    },
    {
      field: 'label',
      headerName: 'Título',
      flex: 1,
      minWidth: 240,
      renderCell: params => {
        const card = params.row;
        const isOpen = expanded.has(card.id);
        const pct = card.progress ? Math.round((card.progress / PROGRESS_MAX) * 100) : 0;
        const names = users
          .filter(u => card.users?.includes(u.id))
          .map(u => u.label)
          .join(', ');

        return (
          <Box sx={{ width: '100%', py: 0.5 }}>
            <Typography sx={{ wordBreak: 'break-word' }}>
              {card.label}
            </Typography>

            {isOpen && (
              <Stack spacing={1} sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                >
                  {card.description || 'Sem descrição'}
                </Typography>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Progresso: {pct}%
                  </Typography>
                  <LinearProgress variant="determinate" value={pct} />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Usuários: {names || 'Nenhum'}
                </Typography>
              </Stack>
            )}
          </Box>
        );
      },
    },
    {
      field: 'column',
      headerName: 'Coluna de origem',
      width: 160,
      renderCell: params => {
        const col = columns.find(c => c.id === params.row.column);
        return col ? (
          <Typography variant="body2">{col.label}</Typography>
        ) : (
          <Typography variant="body2" color="warning.main">Coluna removida</Typography>
        );
      },
    },
    {
      field: 'priority',
      headerName: 'Prioridade',
      width: 130,
      renderCell: params => {
        const pri = priorities.find(p => p.id === params.row.priority);
        return pri ? <Chip size="small" label={pri.label} className={pri.css} /> : <>—</>;
      },
    },
    {
      field: 'deadline',
      headerName: 'Prazo',
      width: 120,
      sortComparator: (a, b) =>
        new Date(a ?? 0).getTime() - new Date(b ?? 0).getTime(),
      renderCell: params =>
        params.row.deadline
          ? new Date(params.row.deadline).toLocaleDateString('pt-BR')
          : <>—</>,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 110,
      getActions: params => [
        <GridActionsCellItem
          key="restore"
          icon={<RestoreFromTrashIcon />}
          label={noColumns ? 'Crie uma coluna para restaurar' : 'Restaurar no board'}
          disabled={noColumns}
          onClick={() => onRestore(params.row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteForeverIcon color="error" />}
          label="Excluir definitivamente"
          onClick={() => askDelete(params.row)}
        />,
      ],
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [expanded, columns, priorities, users, noColumns, onRestore]);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>Cards arquivados</DialogTitle>

        <DialogContent>
          <Box sx={{ height: 480, width: '100%' }}>
            <DataGrid
              rows={archive}
              columns={gridColumns}
              getRowHeight={() => 'auto'}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              localeText={{
                ...ptBR.components.MuiDataGrid.defaultProps.localeText,
                noRowsLabel: 'Nenhum card arquivado',
              }}
              sx={{
                '& .MuiDataGrid-cell': {
                  alignItems: 'flex-start',
                  py: 0.5,
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* confirmação de exclusão definitiva */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Excluir definitivamente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Excluir <strong>{deleting?.label}</strong> de vez? Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" autoFocus>
            Excluir de vez
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ArchiveDialog;