import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (label: string) => void;
  existingLabels?: string[]; // nomes das colunas atuais, para barrar repetidos
};

function CreateColumnForm({ open, onClose, onSubmit, existingLabels = [] }: Props) {
  const [label, setLabel] = useState('');

  const trimmed = label.trim();
  const duplicated = existingLabels.some(l => l.trim().toLowerCase() === trimmed.toLowerCase());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed || duplicated) return;

    onSubmit(trimmed);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ transition: { onExited: () => setLabel('') } }} // limpa ao fechar (enviar ou cancelar)
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nova Coluna</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            required
            label="Nome"
            value={label}
            onChange={e => setLabel(e.target.value)}
            error={duplicated}
            helperText={duplicated ? 'Já existe uma coluna com esse nome' : ' '}
            fullWidth
            margin="dense"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={!trimmed || duplicated}>
            Criar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateColumnForm;