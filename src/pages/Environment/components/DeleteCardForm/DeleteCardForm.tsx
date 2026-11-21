
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
// ajuste o caminho conforme a pasta onde o componente ficar
import type {CardEnv, ColumnEnv, PriorityEnv, userEnv} from "/home/leviatan/Documents/Workspace/Projetos_Faculdade/kanban_front2/mykanban/src/types/environment"

type Props = {
  open: boolean;
  card: CardEnv | null;
  onClose: () => void;
  onConfirm: (card: CardEnv) => void;
};
 
function DeleteCardForm({ open, card, onClose, onConfirm }: Props) {
  const handleConfirm = () => {
    if (!card) return;
    onConfirm(card);
    onClose();
  };
 
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Excluir card</DialogTitle>
 
      <DialogContent>
        <DialogContentText>
        O card <strong>{card?.label}</strong> será movido para os arquivados. De lá você pode restaurá-lo ou excluí-lo definitivamente.
        </DialogContentText>
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
 