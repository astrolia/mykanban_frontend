import '@svar-ui/react-kanban/all.css';
import {useEffect, useState, useCallback} from 'react'
import { Kanban, WillowDark, Editor } from '@svar-ui/react-kanban';
import {Box, Button} from '@mui/material'
import CreateColumnForm from './components/CreateColumnForm/CreateColumnForm'
import DeleteColumnForm from './components/DeleteColumnForm/DeleteColumnForm'
import EditColumnForm from './components/EditColumnForm/EditColumnForm'

import * as userService from '../../services/UserService';

import type {EnvironmentType, CardEnv, ColumnEnv, PriorityEnv, userEnv, ColumnCreateType} from "/home/leviatan/Documents/Workspace/Projetos_Faculdade/kanban_front2/mykanban/src/types/environment"
import CreateCardForm from './components/CreateCardForm/CreateCardForm';
import DeleteCardForm from './components/DeleteCardForm/DeleteCardForm';
import EditCardForm from './components/EditCardForm/EditCardForm';
import KanbanCardContent from './components/KanbanCardContent/KanbanCardContent.tsx';
import ManagePriorityDialog from './components/ManagePriority/ManagePriorityDialog';

import ManageUserDialog from './components/ManageUserDialog/ManageUserDialog';

import ArchiveCard from '/home/leviatan/Documents/Workspace/Projetos_Faculdade/kanban_front2/mykanban/src/pages/Environment/components/ArchiveCard/ArchiveCard.tsx'
import { loadEnvironment, createColumn, deleteColumn, editColumn } from '../../services/Environment.ts';

const emptyEnvObject = {
  id: 0,
  name: "",
  description:"",
  priority: [],
  columns: [],
  cards: [],
  users: [],
  archive: []
}

function KanbanEnvironment() {

  const [createCardOpen, setCreateCardOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [api, setApi] = useState<any>(null)
  const [envObject, setEnvObject] = useState<EnvironmentType>(emptyEnvObject)

  const [selectedCard, setSelectedCard] = useState<CardEnv | null>(null);
  const [editCardOpen, setEditCardOpen] = useState(false);
  const [deleteCardOpen, setDeleteCardOpen] = useState(false);

  const openEdit = useCallback((card: CardEnv) => { setSelectedCard(card); setEditCardOpen(true); }, []);
  const openDelete = useCallback((card: CardEnv) => { setSelectedCard(card); setDeleteCardOpen(true); }, []);

  const [archiveOpen, setArchiveOpen] = useState(false);

  const [prioritiesOpen, setPrioritiesOpen] = useState(false);

  const [usersOpen, setUsersOpen] = useState(false);

  useEffect(() => {

    async function load(){
      try{
          const env: EnvironmentType = await loadEnvironment()

          setEnvObject(env)
      }catch(error){

        alert('Não foi possivel carregar o ambiente')
      }
    }

    load()
  },[])

  const loadColumns = () => {
    const columns = envObject.columns
    return columns
  }

  const loadCards = () => {
    const cards = envObject.cards
    return cards
  }

  const loadPriority = () => {
    const priority = envObject.priority
    return priority
  }

  const loadUsers = () => {
    const users = envObject.users
    return users
  }


  const handleCreateColumn = async (label: string) => {

    //const newColumn = { id: crypto.randomUUID(), label };
    const position = envObject.columns.length

    const column: ColumnCreateType = {label: label, position : position}

    const newColumn = await createColumn(column)

    //chamda para back antes de atualizar estado
    setEnvObject(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }));
  }

  const handleDeleteColumn = async (label: string) => {

    const deletedColumn = envObject.columns.find((item) => item.label === label)

    const newEnvColumns = envObject.columns.filter((item) => 
      item.label !== label
    )

    if (deletedColumn)
      await deleteColumn(deletedColumn.id)

    setEnvObject(prev => ({
      ...prev,
      columns: newEnvColumns
    }));
  }

    const handleEditColumn = async (label: string, newLabel: string) => {

    const newEnvColumns = envObject.columns.filter((item) => {
     if (item.label === label){
      item.label = newLabel
      return item
     }
     return item
    })

    const column = envObject.columns.find((item) => item.label === label)

    if (!column) return

    const editedColumn: ColumnEnv = { ...column, label: newLabel }

    await editColumn(editedColumn)

    setEnvObject(prev => ({
      ...prev,
      columns: newEnvColumns
    }));
  }

    const handleCreateCard = async (newCard: CardEnv) => {

    const card = await createCard(newCard);

    //chamda para back antes de atualizar estado
    setEnvObject(prev => ({
      ...prev,
        cards: [...prev.cards, card],
    }));
  }

  const handleEditCard = (updated: CardEnv) => {
    const { id, ...patch } = updated;
    api.exec("update-card", { id, card: patch });
  };

  // excluir card = arquivar
const handleDeleteCard = (card: CardEnv) => {
  // chamada para o back: arquivar o card
  setEnvObject(prev => ({
    ...prev,
    cards: prev.cards.filter(c => c.id !== card.id),
    archive: prev.archive.some(c => c.id === card.id) ? prev.archive : [...prev.archive, card],
  }));
  api?.exec("delete-card", { id: card.id });
};

const handleRestoreCard = (card: CardEnv) => {
  // chamada para o back: restaurar o card
  setEnvObject(prev => {
    if (prev.columns.length === 0) return prev;
    // se a coluna original foi removida, vai para a primeira
    const column = prev.columns.some(c => c.id === card.column) ? card.column : prev.columns[0].id;
    return {
      ...prev,
      archive: prev.archive.filter(c => c.id !== card.id),
      cards: [...prev.cards, { ...card, column }],
    };
  });
};

const handleDeleteForever = (card: CardEnv) => {
  // chamada para o back: excluir definitivamente
  setEnvObject(prev => ({ ...prev, archive: prev.archive.filter(c => c.id !== card.id) }));
};

  useEffect(() => {
    if (!api) return;

    api.on("update-card", ({ id, card }: any) => {
      setEnvObject(prev => ({
        ...prev,
        cards: prev.cards.map(c => c.id === id ? { ...c, ...card } : c),
      }));
      // chamada para o back
    });

    api.on("delete-card", ({ id }: any) => {
      setEnvObject(prev => ({ ...prev, cards: prev.cards.filter(c => c.id !== id) }));
      // chamada para o back
    });

    api.on("move-card", ({ id, column }: any) => { /* idem */ });
  }, [api]);

const CardContent = useCallback(
  ({ card }: { card: any }) => (
    <KanbanCardContent
      card={card as CardEnv}
      priorities={envObject.priority}
      users={envObject.users}
      onEdit={openEdit}
      onDelete={openDelete}
    />
  ),
  [envObject.priority, envObject.users, openEdit, openDelete]
);


const handleCreatePriority = ({ label, css }: Omit<PriorityEnv, 'id'>) => {
  // chamada para o back (o id virá dele)
  setEnvObject(prev => {
    const nextId = prev.priority.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    return { ...prev, priority: [...prev.priority, { id: nextId, label, css }] };
  });
};

const handleEditPriority = (updated: PriorityEnv) => {
  // chamada para o back
  setEnvObject(prev => ({
    ...prev,
    priority: prev.priority.map(p => p.id === updated.id ? updated : p),
  }));
};

const handleDeletePriority = (priority: PriorityEnv) => {
  // chamada para o back
  // os cards ficam no store da SVAR, então a limpeza vai pelo api
  envObject.cards
    .filter(c => c.priority === priority.id)
    .forEach(c => api?.exec("update-card", { id: c.id, card: { priority: null } }));

  setEnvObject(prev => ({
    ...prev,
    priority: prev.priority.filter(p => p.id !== priority.id),
  }));
};

const handleAddUser = async (email: string) => {
  const user = await userService.findByEmail(email); // back: busca o usuário pelo e-mail
  if (envObject.users.some(u => u.id === user.id)) {
    throw new Error('Esse usuário já faz parte do ambiente');
  }
  // chamada para o back: vincular o usuário ao ambiente
  setEnvObject(prev => ({ ...prev, users: [...prev.users, user] }));
};

const handleRemoveUser = (user: userEnv) => {
  // chamada para o back: desvincular o usuário do ambiente
  // os cards ficam no store da SVAR, então a limpeza vai pelo api
  envObject.cards
    .filter(c => c.users?.includes(user.id))
    .forEach(c =>
      api?.exec("update-card", {
        id: c.id,
        card: { users: c.users!.filter(id => id !== user.id) },
      })
    );

  setEnvObject(prev => ({ ...prev, users: prev.users.filter(u => u.id !== user.id) }));
};

  return (
  <Box sx={{
    display:'flex',
    alignItems:'center',
    height:'100vh',
    width:'100%',
    justifyContent:'center'
  }}>

    <Box sx={{display:'flex', width:'100%', height:'85%', alignItems:'center', justifyContent:'center'}}>
      <WillowDark>
        <Box sx={{display: 'flex', widht:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
          <Box sx={{display: 'flex', height:'90%',maxHeight:'90%', maxWidth:"100%"}}>
              <Kanban init={setApi} cards={envObject.cards} columns={envObject.columns} cardContent={CardContent} />

              <EditCardForm
                open={editCardOpen} card={selectedCard}
                columns={envObject.columns} priorities={envObject.priority} users={envObject.users}
                onClose={() => setEditCardOpen(false)} onSubmit={handleEditCard}
              />
              <DeleteCardForm
                open={deleteCardOpen} card={selectedCard}
                onClose={() => setDeleteCardOpen(false)} onConfirm={handleDeleteCard}
              />
            <Button onClick={() => setCreateOpen(true)} sx={{marginTop: '15px', height:"5vh"}}>CRIAR COLUNA</Button>
            <CreateColumnForm open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreateColumn}/>
            <Button onClick={() => setDeleteOpen(true)} sx={{marginTop: '15px', height:"5vh"}}>DELETAR COLUNA</Button>
            <DeleteColumnForm open={deleteOpen} onClose={() => setDeleteOpen(false)} onSubmit={handleDeleteColumn}/>
            <Button onClick={() => setEditOpen(true)} sx={{marginTop: '15px', height:"5vh"}}>EDITAR COLUNA</Button>
            <EditColumnForm open={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEditColumn}/>
            <Button onClick={() => setCreateCardOpen(true)} sx={{marginTop: '15px', height:"5vh"}}>Criar Card</Button>
            <CreateCardForm columns={loadColumns()} prioritys={loadPriority()} users={loadUsers()} open={createCardOpen} onClose={() => setCreateCardOpen(false)} onSubmit={handleCreateCard}/>
              <Button onClick={() => setPrioritiesOpen(true)} sx={{ marginTop: '15px', height: "5vh" }}>PRIORIDADES</Button>
            <ManagePriorityDialog
              open={prioritiesOpen}
              onClose={() => setPrioritiesOpen(false)}
              priorities={envObject.priority}
              cards={envObject.cards}
              onCreate={handleCreatePriority}
              onEdit={handleEditPriority}
              onDelete={handleDeletePriority}
            />
            <Button onClick={() => setUsersOpen(true)} sx={{ marginTop: '15px', height: "5vh" }}>USUÁRIOS</Button>
            <ManageUserDialog
              open={usersOpen}
              onClose={() => setUsersOpen(false)}
              users={envObject.users}
              cards={envObject.cards}
              onAdd={handleAddUser}
              onRemove={handleRemoveUser}
            />
            <Button onClick={() => setArchiveOpen(true)} sx={{ marginTop: '15px', height: "5vh" }}>
              ARQUIVADOS ({envObject.archive.length})
            </Button>
            <ArchiveCard
              open={archiveOpen}
              onClose={() => setArchiveOpen(false)}
              archive={envObject.archive}
              columns={envObject.columns}
              priorities={envObject.priority}
              users={envObject.users}
              onRestore={handleRestoreCard}
              onDeleteForever={handleDeleteForever}
            />

          </Box>
        </Box>
      </WillowDark>
    </Box>

  </Box>
  );
}


export default KanbanEnvironment;