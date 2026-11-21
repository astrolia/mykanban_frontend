import {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button} from '@mui/material';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (label: string) => void
}


function CreateColumnForm({open, onClose, onSubmit}: Props){

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
                <DialogTitle>Nova Coluna</DialogTitle>

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
                    <Button type='submit' variant='contained'>Criar</Button>
                </DialogActions>
            </form>
        </Dialog>
        
    )
}

export default CreateColumnForm;