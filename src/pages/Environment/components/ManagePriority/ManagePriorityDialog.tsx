import { useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, Stack, TextField, Tooltip, Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
// ajuste o caminho conforme a pasta onde o componente ficar
import type {CardEnv, ColumnEnv, PriorityEnv, userEnv} from "/home/leviatan/Documents/Workspace/Projetos_Faculdade/kanban_front2/mykanban/src/types/environment"

import './priorities.css';

// Classes definidas em priorities.css
const PALETTE = [
  { css: 'priority-red', name: 'Vermelho' },
  { css: 'priority-orange', name: 'Laranja' },
  { css: 'priority-yellow', name: 'Amarelo' },
  { css: 'priority-green', name: 'Verde' },
  { css: 'priority-blue', name: 'Azul' },
  { css: 'priority-purple', name: 'Roxo' },
  { css: 'priority-grey', name: 'Cinza' },
];

type Props = {
  open: boolean;
  onClose: () => void;
  priorities: PriorityEnv[];
  cards: CardEnv[]; // usado só para contar quantos cards usam cada prioridade
  onCreate: (priority: Omit<PriorityEnv, 'id'>) => void;
  onEdit: (priority: PriorityEnv) => void;
  onDelete: (priority: PriorityEnv) => void;
};

function ManagePrioritiesDialog({
  open, onClose, priorities, cards, onCreate, onEdit, onDelete,
}: Props) {
  const [editing, setEditing] = useState<PriorityEnv | null>(null);
  const [label, setLabel] = useState('');
  const [css, setCss] = useState(PALETTE[0].css);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const reset = () => {
    setEditing(null);
    setLabel('');
    setCss(PALETTE[0].css);
    setConfirmingId(null);
  };

  const trimmed = label.trim();
  const duplicated = priorities.some(
    p => p.id !== editing?.id && p.label.trim().toLowerCase() === trimmed.toLowerCase(),
  );
  const invalid = !trimmed || duplicated;

  const usageCount = (id: number) => cards.filter(c => c.priority === id).length;

  const startEdit = (p: PriorityEnv) => {
    setEditing(p);
    setLabel(p.label);
    setCss(p.css);
    setConfirmingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invalid) return;

    if (editing) onEdit({ ...editing, label: trimmed, css });
    else onCreate({ label: trimmed, css });

    reset();
  };

  const handleConfirmDelete = (p: PriorityEnv) => {
    onDelete(p);
    if (editing?.id === p.id) reset();
    else setConfirmingId(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ transition: { onExited: reset } }}
    >
      <DialogTitle>Prioridades</DialogTitle>

      <DialogContent>
        {/* lista */}
        {priorities.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            Nenhuma prioridade criada ainda.
          </Typography>
        )}

        {priorities.map(p => {
          const count = usageCount(p.id);
          const confirming = confirmingId === p.id;

          return (
            <Stack
              key={p.id}
              direction="row"
              sx={{ py: 0.75 }}
            >
              <Stack spacing={0.25}>
                <Box>
                  <Chip size="small" label={p.label} className={p.css} />
                </Box>
                {confirming ? (
                  <Typography variant="caption" color="error">
                    {count > 0
                      ? `${count} card(s) usam esta prioridade e ficarão sem prioridade. Excluir?`
                      : 'Excluir esta prioridade?'}
                  </Typography>
                ) : (
                  count > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {count} card(s)
                    </Typography>
                  )
                )}
              </Stack>

              <Stack direction="row" sx={{ flexShrink: 0 }}>
                {confirming ? (
                  <>
                    <Button size="small" onClick={() => setConfirmingId(null)}>Não</Button>
                    <Button size="small" color="error" onClick={() => handleConfirmDelete(p)}>
                      Excluir
                    </Button>
                  </>
                ) : (
                  <>
                    <Tooltip title="Editar">
                      <IconButton size="small" aria-label="Editar prioridade" onClick={() => startEdit(p)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        color="error"
                        aria-label="Excluir prioridade"
                        onClick={() => setConfirmingId(p.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Stack>
            </Stack>
          );
        })}

        <Divider sx={{ my: 2 }} />

        {/* formulário de criar / editar */}
        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle2">
            {editing ? 'Editar prioridade' : 'Nova prioridade'}
          </Typography>

          <TextField
            label="Nome"
            value={label}
            onChange={e => setLabel(e.target.value)}
            error={duplicated}
            helperText={duplicated ? 'Já existe uma prioridade com esse nome' : ' '}
            fullWidth
            margin="dense"
          />

          <Typography variant="caption" color="text.secondary">Cor</Typography>
          <Stack direction="row" sx={{ mt: 0.5, mb: 1.5 }}>
            {PALETTE.map(c => (
              <Tooltip key={c.css} title={c.name}>
                <Box
                  component="button"
                  type="button"
                  aria-label={c.name}
                  aria-pressed={css === c.css}
                  className={c.css}
                  onClick={() => setCss(c.css)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    outline: theme =>
                      css === c.css ? `3px solid ${theme.palette.primary.main}` : 'none',
                    outlineOffset: 2,
                  }}
                />
              </Tooltip>
            ))}
          </Stack>

          <Stack direction="row" >
            <Chip size="small" label={trimmed || 'Pré-visualização'} className={css} />

            <Stack direction="row">
              {editing && <Button onClick={reset}>Cancelar edição</Button>}
              <Button type="submit" variant="contained" disabled={invalid}>
                {editing ? 'Salvar' : 'Adicionar'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ManagePrioritiesDialog;