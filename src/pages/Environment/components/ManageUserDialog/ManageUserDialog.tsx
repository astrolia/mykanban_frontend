import { useState } from 'react';
import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, Stack, TextField, Tooltip, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
// ajuste o caminho conforme a pasta onde o componente ficar
import type {CardEnv, ColumnEnv, PriorityEnv, userEnv} from "../../../../types/REMOVERenvironment"

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

type Props = {
  open: boolean;
  onClose: () => void;
  users: userEnv[];
  cards: CardEnv[]; // usado só para contar em quantos cards cada usuário está
  // deve lançar um Error com a mensagem a exibir se não conseguir adicionar
  onAdd: (email: string) => Promise<void>;
  onRemove: (user: userEnv) => void | Promise<void>;
};

function ManageUsersDialog({ open, onClose, users, cards, onAdd, onRemove }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const reset = () => {
    setEmail('');
    setLoading(false);
    setError(null);
    setConfirmingId(null);
  };

  const trimmed = email.trim();
  const emailValid = EMAIL_REGEX.test(trimmed);
  const showInvalid = trimmed.length > 0 && !emailValid;

  const assignedCount = (id: number) => cards.filter(c => c.users?.includes(id)).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || loading) return;

    setLoading(true);
    setError(null);
    try {
      await onAdd(trimmed);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível adicionar o usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRemove = async (user: userEnv) => {
    setError(null);
    try {
      await onRemove(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível remover o usuário');
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ transition: { onExited: reset } }}
    >
      <DialogTitle>Usuários do ambiente</DialogTitle>

      <DialogContent>
        {/* lista */}
        {users.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            Nenhum usuário neste ambiente.
          </Typography>
        )}

        {users.map(u => {
          const count = assignedCount(u.id);
          const confirming = confirmingId === u.id;

          return (
            <Stack
              key={u.id}
              direction="row"
              sx={{ py: 0.75 }}
            >
              <Stack direction="row" sx={{ minWidth: 0 }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                  {u.label.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap>{u.label}</Typography>
                  {confirming ? (
                    <Typography variant="caption" color="error">
                      {count > 0
                        ? `Está em ${count} card(s) e será retirado deles. Remover do ambiente?`
                        : 'Remover este usuário do ambiente?'}
                    </Typography>
                  ) : (
                    count > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        {count} card(s)
                      </Typography>
                    )
                  )}
                </Box>
              </Stack>

              <Stack direction="row" sx={{ flexShrink: 0 }}>
                {confirming ? (
                  <>
                    <Button size="small" onClick={() => setConfirmingId(null)}>Não</Button>
                    <Button size="small" color="error" onClick={() => handleConfirmRemove(u)}>
                      Remover
                    </Button>
                  </>
                ) : (
                  <Tooltip title="Remover do ambiente">
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="Remover usuário do ambiente"
                      onClick={() => setConfirmingId(u.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          );
        })}

        <Divider sx={{ my: 2 }} />

        {/* adicionar por e-mail */}
        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle2">Adicionar usuário</Typography>

          <TextField
            label="E-mail do usuário"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(null); }}
            error={showInvalid || !!error}
            helperText={error ?? (showInvalid ? 'E-mail inválido' : ' ')}
            disabled={loading}
            fullWidth
            margin="dense"
          />

          <Stack direction="row" >
            <Button type="submit" variant="contained" disabled={!emailValid || loading}>
              {loading ? 'Buscando...' : 'Adicionar'}
            </Button>
          </Stack>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ManageUsersDialog;