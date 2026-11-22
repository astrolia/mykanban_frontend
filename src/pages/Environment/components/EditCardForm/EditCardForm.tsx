import { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Slider, TextField, Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { parseISO, startOfDay } from 'date-fns';
// src/pages/Environment/components/EditCardForm/ -> src/types/
import type { CardEnv } from '../../../../types/CardsType';
import type { ColumnEnv } from '../../../../types/ColumnsType';
import type { PriorityEnv } from '../../../../types/PriorityType';
import type { userEnv } from '../../../../types/UserType';

// O deadline pode chegar do back como string ("2026-11-21" ou ISO completo).
// parseISO lê "2026-11-21" como data local; new Date("2026-11-21") leria como UTC
// e mostraria o dia anterior no Brasil.
const toDate = (value?: Date | string | null): Date | null => {
  if (!value) return null;
  return typeof value === 'string' ? parseISO(value) : value;
};

type Props = {
  open: boolean;
  card: CardEnv | null;
  columns: ColumnEnv[];
  priorities: PriorityEnv[];
  users: userEnv[];
  onClose: () => void;
  onSubmit: (card: CardEnv) => void;
};

type ContentProps = Omit<Props, 'open' | 'card'> & { card: CardEnv };

/**
 * O conteúdo fica num componente separado, montado só quando o diálogo está aberto.
 * Assim o estado é inicializado a partir do card toda vez que o diálogo abre,
 * sem precisar de useEffect nem de reset ao cancelar.
 */
function EditCardFormContent({ card, columns, priorities, users, onClose, onSubmit }: ContentProps) {
  const [label, setLabel] = useState(card.label);
  const [description, setDescription] = useState(card.description ?? '');
  const [column, setColumn] = useState<ColumnEnv['id'] | ''>(card.column);
  const [priority, setPriority] = useState<number | ''>(card.priority ?? '');
  const [progress, setProgress] = useState(card.progress ?? 0); // 0 a 100
  const [date, setDate] = useState<Date | null>(toDate(card.deadline));
  const [selectedUsers, setSelectedUsers] = useState<number[]>(card.users ?? []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || column === '') return;

    onSubmit({
      ...card, // mantém o id e qualquer outro campo que o formulário não edita
      label: label.trim(),
      description: description.trim() || undefined,
      column,
      priority: priority === '' ? undefined : priority,
      progress,
      deadline: date ? startOfDay(date) : undefined,
      users: selectedUsers,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Editar card</DialogTitle>

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
          {priorities.map(pri => (
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

        {/* requer LocalizationProvider (AdapterDateFns, ptBR) na raiz do app */}
        <DatePicker
          label="Prazo"
          value={date}
          onChange={v => setDate(v)}
          slotProps={{
            textField: { fullWidth: true, margin: 'dense' },
            field: { clearable: true },
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained">Salvar alterações</Button>
      </DialogActions>
    </form>
  );
}

function EditCardForm({ open, card, onClose, ...rest }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      {card && <EditCardFormContent key={card.id} card={card} onClose={onClose} {...rest} />}
    </Dialog>
  );
}

export default EditCardForm;