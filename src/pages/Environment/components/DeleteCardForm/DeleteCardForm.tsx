
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Checkbox,
  Typography
} from '@mui/material';
// ajuste o caminho conforme a pasta onde o componente ficar
import type { CardEnv } from '../../../../types/CardsType'
import { useState } from 'react';

type Props = {
  open: boolean;
  card: CardEnv | null;
  onClose: () => void;
  onConfirm: (card: CardEnv) => void;
};
 
function DeleteCardForm({ open, card, onClose, onConfirm }: Props) {

  const [done, setDone] = useState(false)

  const handleConfirm = () => {
    if (!card) return;

    card.done = done
    onConfirm(card);
    onClose();
  };
 
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Arquivar card</DialogTitle>
 
      <DialogContent>
        <DialogContentText>
        O card <strong>{card?.label}</strong> será arquivado.
        </DialogContentText>
        <Typography>Marcar como concluido:         <Checkbox
        checked={done} 
        onChange={(e) => setDone(e.target.checked)} 
        color="primary" 
      /></Typography>
      </DialogContent>
 
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} color="error" variant="contained" autoFocus>
          Excluir card
        </Button>
      </DialogActions>
    </Dialog>
  );
}
 
export default DeleteCardForm;
 