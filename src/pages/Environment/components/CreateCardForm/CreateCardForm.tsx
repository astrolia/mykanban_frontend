import { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Slider, TextField, Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { startOfDay } from 'date-fns';
import type { CardEnv } from '../../../../types/CardsType';
import type { ColumnEnv } from '../../../../types/ColumnsType';
import type { PriorityEnv } from '../../../../types/PriorityType';
import type { userEnv } from '../../../../types/UserType';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (card: Omit<CardEnv, 'id'>) => void;
  columns: ColumnEnv[];
  prioritys: PriorityEnv[];
  users: userEnv[];
};

function CreateCardForm({ open, onClose, onSubmit, columns, prioritys, users }: Props) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [column, setColumn] = useState<ColumnEnv['id'] | ''>('');
  const [priority, setPriority] = useState<number | ''>('');
  const [progress, setProgress] = useState(0);
  const [date, setDate] = useState<Date | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const noColumns = columns.length === 0;

  const reset = () => {
    setLabel(''); setDescription(''); setColumn('');
    setPriority(''); setProgress(0); setDate(null); setSelectedUsers([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || column === '') return;

    onSubmit({
      label: label.trim(),
      description: description.trim() || undefined,
      column,
      priority: priority === '' ? undefined : priority,
      progress,
      deadline: date ? startOfDay(date) : undefined,
      users: selectedUsers,
      archived: false,
    });
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
        <DialogTitle>Novo Card</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus required label="Título" value={label}
            onChange={e => setLabel(e.target.value)}
            fullWidth margin="dense"
          />

          <TextField
            label="Descrição" value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth margin="dense" multiline minRows={2}
          />

          <TextField
            select required label="Coluna" value={column}
            onChange={e => setColumn(Number(e.target.value))}
            disabled={noColumns}
            helperText={noColumns ? 'Crie uma coluna antes de criar cards' : undefined}
            fullWidth margin="dense"
          >
            {columns.map(col => (
              <MenuItem key={col.id} value={col.id}>{col.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            select label="Prioridade" value={priority}
            onChange={e => setPriority(e.target.value === '' ? '' : Number(e.target.value))}
            slotProps={{ inputLabel: { shrink: true }, select: { displayEmpty: true } }}
            fullWidth margin="dense"
          >
            <MenuItem value="">Nenhuma</MenuItem>
            {prioritys.map(pri => (
              <MenuItem key={pri.id} value={pri.id}>{pri.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            select label="Usuários" value={selectedUsers}
            onChange={e => {
              const v = e.target.value as unknown;
              setSelectedUsers(typeof v === 'string' ? v.split(',').map(Number) : (v as number[]));
            }}
            slotProps={{
              select: {
                multiple: true,
                renderValue: selected =>
                  users
                    .filter(u => (selected as number[]).includes(u.id))
                    .map(u => u.label)
                    .join(', '),
              },
            }}
            fullWidth margin="dense"
          >
            {users.map(u => (
              <MenuItem key={u.id} value={u.id}>{u.label}</MenuItem>
            ))}
          </TextField>

          <Typography gutterBottom sx={{ mt: 2 }}>Progresso</Typography>
          <Slider
            value={progress}
            onChange={(_, v) => setProgress(v as number)}
            min={0} max={100} step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={v => `${v}%`}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              label="Prazo"
              value={date}
              onChange={v => setDate(v)}
              slotProps={{
                textField: { fullWidth: true, margin: 'dense' },
                field: { clearable: true },
              }}
            />
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={noColumns}>Criar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateCardForm;