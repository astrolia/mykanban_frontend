import {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button} from '@mui/material';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (label: string) => void
}


function DeleteColumnForm({open, onClose, onSubmit}: Props){

    const [label, setLabel] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!label.trim())
            return;
        
        onSubmit(label.trim());
        setLabel('');
        onClose();
    }

    return(
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Deletar Coluna</DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        label="Nome"
                        value={label}
                        onChange={e => setLabel(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type='submit' variant='contained'>Deletar</Button>
                </DialogActions>
            </form>
        </Dialog>
        
    )
}

export default DeleteColumnForm;