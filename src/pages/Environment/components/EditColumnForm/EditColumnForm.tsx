import { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField,
} from '@mui/material';
import type { ColumnEnv } from '../../../../types/ColumnsType';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (columnId: ColumnEnv['id'], newLabel: string) => void;
  columns: ColumnEnv[];
};

function EditColumnForm({ open, onClose, onSubmit, columns }: Props) {
  const [columnId, setColumnId] = useState<ColumnEnv['id'] | ''>('');
  const [newLabel, setNewLabel] = useState('');

  const selected = columns.find(c => c.id === columnId);
  const trimmed = newLabel.trim();

  const duplicated =
    columnId !== '' &&
    columns.some(c => c.id !== columnId && c.label.trim().toLowerCase() === trimmed.toLowerCase());
  const unchanged = !!selected && selected.label === trimmed;
  const invalid = columnId === '' || !trimmed || duplicated || unchanged;

  const reset = () => {
    setColumnId('');
    setNewLabel('');
  };

  const handleSelect = (id: ColumnEnv['id']) => {
    setColumnId(id);
    setNewLabel(columns.find(c => c.id === id)?.label ?? '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (columnId === '' || invalid) return;

    onSubmit(columnId, trimmed);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ transition: { onExited: reset } }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Editar Coluna</DialogTitle>

        <DialogContent>
          <TextField
            select
            required
            autoFocus
            label="Coluna"
            value={columnId}
            onChange={e => handleSelect(Number(e.target.value))}
            disabled={columns.length === 0}
            helperText={columns.length === 0 ? 'Não há colunas para editar' : undefined}
            fullWidth
            margin="dense"
          >
            {columns.map(col => (
              <MenuItem key={col.id} value={col.id}>{col.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            required
            label="Novo nome"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            disabled={columnId === ''}
            error={duplicated}
            helperText={duplicated ? 'Já existe uma coluna com esse nome' : ' '}
            fullWidth
            margin="dense"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={invalid}>
            Confirmar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditColumnForm;