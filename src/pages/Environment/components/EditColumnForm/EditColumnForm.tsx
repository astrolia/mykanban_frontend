import {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button} from '@mui/material';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (label: string, newlabel: string) => void
}


function DeleteColumnForm({open, onClose, onSubmit}: Props){

    const [label, setLabel] = useState('')
    const [newLabel, setNewLabel] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!label.trim() || !newLabel.trim())
            return;
        
        onSubmit(label.trim(), newLabel.trim());
        setLabel('');
        setNewLabel('');
        onClose();
    }

    return(
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Editar Coluna</DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        label="Nome da Coluna"
                        value={label}
                        onChange={e => setLabel(e.target.value)}
                        fullWidth
                        margin="dense"
                    />

                    <TextField
                        autoFocus
                        label="Novo Nome"
                        value={newLabel}
                        onChange={e => setNewLabel(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type='submit' variant='contained'>Confirmar</Button>
                </DialogActions>
            </form>
        </Dialog>
        
    )
}

export default DeleteColumnForm;