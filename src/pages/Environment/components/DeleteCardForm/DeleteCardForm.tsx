
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Checkbox,
  Typography
} from '@mui/material';
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

  const handleClose = () => {
    setDone(false)
    onClose()
  }

  const handleConfirm = () => {
    if (!card) return;

    onConfirm({ ...card, done });
    handleClose();
  };
 
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
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
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleConfirm} color="error" variant="contained" autoFocus>
          Excluir card
        </Button>
      </DialogActions>
    </Dialog>
  );
}
 
export default DeleteCardForm;
 