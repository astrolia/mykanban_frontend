import '@svar-ui/react-kanban/all.css';
import {useState} from 'react'
import { Kanban, WillowDark, Editor } from '@svar-ui/react-kanban';
import {Box} from '@mui/material'

const columns = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'progress', label: 'Progress' },
  { id: 'done', label: 'Done' },
  { id: 'new', label: 'new' },
];

const cards = [
  { id: 1, label: 'Fix login bug', column: 'backlog', priority: 2 },
  { id: 2, label: 'Write tests', column: 'progress', priority: 1 },
];

function KanbanDashboard() {

  const [api, setApi] = useState<any>(null)
  return (
    <Box sx={{margin: '0px', height: '100vh',display: 'flex', width:'100%', padding:'0'}}>
      <WillowDark>
        <Kanban init={setApi} cards={cards} columns={columns} />
        {api && <Editor api={api}/>}
      </WillowDark>
    </Box>
  );
}


export default KanbanDashboard;