import {
  Avatar, AvatarGroup, Box, Chip, IconButton, LinearProgress,
  Stack, Tooltip, Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { parseISO } from 'date-fns';
// src/pages/Environment/components/KanbanCardContent/ -> src/types/
import type { CardEnv } from '../../../../types/CardsType';
import type { PriorityEnv } from '../../../../types/PriorityType';
import type { userEnv } from '../../../../types/UserType';

// Escala do progresso: mesma do CreateCardForm e do EditCardForm (0 a 100)
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

// O deadline pode chegar do back como string ("2026-11-21" ou ISO completo).
// parseISO lê "2026-11-21" como data local; new Date("2026-11-21") leria como UTC
// e mostraria o dia anterior no Brasil.
const formatDeadline = (value: Date | string): string => {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return date.toLocaleDateString('pt-BR');
};

function KanbanCardContent({ card, priorities, users, onEdit, onDelete }: Props) {
  const priority = priorities.find(p => p.id === card.priority);
  const cardUsers = users.filter(u => card.users?.includes(u.id));
  const progress = Math.min(100, Math.max(0, ((card.progress ?? 0) / PROGRESS_MAX) * 100));

  return (
    <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
      {/* título + ações */}
      <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 1 }}>
        {/* flex:1 + minWidth:0 faz o título ocupar o espaço e quebrar linha, empurrando os botões para a direita */}
        <Typography variant="subtitle2" sx={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>
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

      {card.progress != null && (
        <LinearProgress variant="determinate" value={progress} />
      )}

      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          {card.deadline ? formatDeadline(card.deadline) : ''}
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