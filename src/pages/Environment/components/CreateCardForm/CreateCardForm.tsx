import { useState } from 'react';
import {
  Slider, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem,
} from '@mui/material';
import type {CardEnv, ColumnEnv, PriorityEnv, userEnv} from "/home/leviatan/Documents/Workspace/Projetos_Faculdade/kanban_front2/mykanban/src/types/environment"

import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (card: CardEnv) => void;
  columns: ColumnEnv[];
  prioritys: PriorityEnv[];
  users: userEnv[];
};

function CreateCardForm({ open, onClose, onSubmit, columns, prioritys, users }: Props) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [column, setColumn] = useState('');
  const [priority, setPriority] = useState<number | ''>('');
  const [progress, setProgress] = useState(0);
  const [date, setDate] = useState<Date | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const reset = () => {
    setLabel(''); setDescription(''); setColumn('');
    setPriority(''); setProgress(0); setDate(null); setSelectedUsers([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !column) return;

    onSubmit({
        id: 0,
      label: label.trim(),
      description: description.trim() || undefined,
      column,
      priority: priority === '' ? undefined : priority,
      progress,
      deadline: date ?? undefined,
      users: selectedUsers,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Novo Card</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus label="Título" value={label}
            onChange={e => setLabel(e.target.value)}
            fullWidth margin="dense"
          />

          <TextField
            label="Descrição" value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth margin="dense" multiline minRows={2}
          />

          <TextField select label="Coluna" value={column}
            onChange={e => setColumn(String(e.target.value))} fullWidth margin="dense">
            {columns.map(col => (
              <MenuItem key={col.id} value={col.id}>{col.label}</MenuItem>
            ))}
          </TextField>

          <TextField select label="Prioridade" value={priority}
            onChange={e => setPriority(Number(e.target.value))} fullWidth margin="dense">
            {prioritys.map(pri => (
              <MenuItem key={pri.id} value={pri.id}>{pri.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            select label="Usuários" value={selectedUsers}
            onChange={e => setSelectedUsers(e.target.value as unknown as number[])}
            slotProps={{ select: { multiple: true } }}
            fullWidth margin="dense">
            {users.map(u => (
              <MenuItem key={u.id} value={u.id}>{u.label}</MenuItem>
            ))}
          </TextField>

          <Typography gutterBottom sx={{ mt: 2 }}>Progresso</Typography>
          <Slider
            value={progress}
            onChange={(_, v) => setProgress(v as number)}
            min={0} max={1} step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={v => `${Math.round(v * 100)}%`}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DateCalendar value={date} onChange={v => setDate(v)} />
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Criar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateCardForm;