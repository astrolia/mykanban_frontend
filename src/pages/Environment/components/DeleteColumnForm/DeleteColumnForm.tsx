import { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField,
} from '@mui/material';
// src/pages/Environment/components/DeleteColumnForm/ -> src/types/
import type { ColumnEnv } from '../../../../types/ColumnsType';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (columnId: ColumnEnv['id']) => void;
  columns: ColumnEnv[];
  columnsWithCards?: ColumnEnv['id'][]; // colunas que ainda têm cards (inclusive arquivados)
};

function DeleteColumnForm({ open, onClose, onSubmit, columns, columnsWithCards = [] }: Props) {
  const [columnId, setColumnId] = useState<ColumnEnv['id'] | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (columnId === '') return;

    onSubmit(columnId);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ transition: { onExited: () => setColumnId('') } }} // limpa ao fechar
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Deletar Coluna</DialogTitle>

        <DialogContent>
          <TextField
            select
            required
            autoFocus
            label="Coluna"
            value={columnId}
            onChange={e => setColumnId(Number(e.target.value))}
            disabled={columns.length === 0}
            helperText={
              columns.length === 0
                ? 'Não há colunas para excluir'
                : 'Só é possível excluir colunas sem cards (inclusive arquivados)'
            }
            fullWidth
            margin="dense"
          >
            {columns.map(col => {
              const blocked = columnsWithCards.includes(col.id);
              return (
                <MenuItem key={col.id} value={col.id} disabled={blocked}>
                  {col.label}{blocked ? ' (tem cards)' : ''}
                </MenuItem>
              );
            })}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="error" disabled={columnId === ''}>
            Deletar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default DeleteColumnForm;