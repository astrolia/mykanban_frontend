
import {
  Avatar, AvatarGroup, Box, Chip, IconButton, LinearProgress,
  Stack, Tooltip, Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
// ajuste o caminho conforme a pasta onde o componente ficar
import type {CardEnv, ColumnEnv, PriorityEnv, userEnv} from "/home/leviatan/Documents/Workspace/Projetos_Faculdade/kanban_front2/mykanban/src/types/environment"

// Escala do progresso: 100 se for 0-100, ou 1 se a SVAR usar 0-1.
// Use a mesma constante no CreateCardForm / EditCardForm.
const PROGRESS_MAX = 100;
 
type Props = {
  card: CardEnv;
  priorities: PriorityEnv[];
  users: userEnv[];
  onEdit: (card: CardEnv) => void;
  onDelete: (card: CardEnv) => void;
};
 
// Impede que o clique/arraste nos botões chegue ao card (seleção e drag-and-drop)
const stop = (e: React.SyntheticEvent) => e.stopPropagation();
 
function KanbanCardContent({ card, priorities, users, onEdit, onDelete }: Props) {
  const priority = priorities.find(p => p.id === card.priority);
  const cardUsers = users.filter(u => card.users?.includes(u.id));
  const progress = card.progress ? (card.progress / PROGRESS_MAX) * 100 : 0;
 
  return (
    <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
      {/* título + ações */}
      <Stack direction="row">
        <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
          {card.label}
        </Typography>
 
        <Stack direction="row" sx={{ flexShrink: 0 }} onPointerDown={stop} onMouseDown={stop}>
          <Tooltip title="Editar card">
            <IconButton
              size="small"
              aria-label="Editar card"
              onClick={e => { stop(e); onEdit(card); }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
 
          <Tooltip title="Excluir card">
            <IconButton
              size="small"
              color="error"
              aria-label="Excluir card"
              onClick={e => { stop(e); onDelete(card); }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
 
      {card.description && (
        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
          {card.description}
        </Typography>
      )}
 
      {priority && (
        <Box>
          <Chip size="small" label={priority.label} className={priority.css} />
        </Box>
      )}
 
      {card.progress !== undefined && (
        <LinearProgress variant="determinate" value={progress} />
      )}
 
      <Stack direction="row" >
        <Typography variant="caption" color="text.secondary">
          {card.deadline ? new Date(card.deadline).toLocaleDateString('pt-BR') : ''}
        </Typography>
 
        {cardUsers.length > 0 && (
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
            {cardUsers.map(u => (
              <Tooltip key={u.id} title={u.label}>
                <Avatar>{u.label.charAt(0).toUpperCase()}</Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
        )}
      </Stack>
    </Box>
  );
}
 
export default KanbanCardContent;
 