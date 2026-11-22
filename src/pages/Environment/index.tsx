import '@svar-ui/react-kanban/all.css'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Kanban, WillowDark } from '@svar-ui/react-kanban'
import { Box, Button, Paper, Typography, Divider } from '@mui/material'
import toast from 'react-hot-toast'

import CreateColumnForm from './components/CreateColumnForm/CreateColumnForm'
import DeleteColumnForm from './components/DeleteColumnForm/DeleteColumnForm'
import EditColumnForm from './components/EditColumnForm/EditColumnForm'
import CreateCardForm from './components/CreateCardForm/CreateCardForm'
import DeleteCardForm from './components/DeleteCardForm/DeleteCardForm'
import EditCardForm from './components/EditCardForm/EditCardForm'
import KanbanCardContent from './components/KanbanCardContent/KanbanCardContent'
import ManagePriorityDialog from './components/ManagePriority/ManagePriorityDialog'
import ManageUserDialog from './components/ManageUserDialog/ManageUserDialog'
import ArchiveCard from './components/ArchiveCard/ArchiveCard'

import * as userService from '../../services/UserService'
import { loadEnvironment, addUserEnvironment, deleteUserEnvironment } from '../../services/EnvironmentService'
import { ColumnCRUD } from '../../services/ColumnService'
import { CardCRUD } from '../../services/CardService'
import { PriorityCRUD } from '../../services/PriorityService'
import { msgErro } from '../../utils/erro'

import type { EnvironmentType, EnvironmentResponseType } from '../../types/EnvironmentType'
import type { CardEnv } from '../../types/CardsType'
import type { PriorityEnv } from '../../types/PriorityType'
import type { ColumnEnv, ColumnCreateType } from '../../types/ColumnsType'
import type { userEnv } from '../../types/UserType'

const emptyEnvObject: EnvironmentType = {
  id: 0,
  name: "",
  description:"",
  owner: 0,
  priority: [],
  columns: [],
  cards: [],
  users: [],
  archive: []
}

const organizeEnv = (env: EnvironmentResponseType) => {
  return {
      id: env.id,
      name: env.name,
      description: env.description,
      owner: env.owner,
      priority: env.priority,
      columns: env.columns,
      cards: env.cards.filter((item) => !item.archived),
      users: env.users,
      archive: env.cards.filter((item) => item.archived)
  }
}

function KanbanEnvironment() {
  const { envId } = useParams()

  const [createCardOpen, setCreateCardOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [api, setApi] = useState<any>(null)
  const [envObject, setEnvObject] = useState<EnvironmentType>(emptyEnvObject)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [selectedCard, setSelectedCard] = useState<CardEnv | null>(null);
  const [editCardOpen, setEditCardOpen] = useState(false);
  const [deleteCardOpen, setDeleteCardOpen] = useState(false);

  const openEdit = useCallback((card: CardEnv) => { setSelectedCard(card); setEditCardOpen(true); }, []);
  const openDelete = useCallback((card: CardEnv) => { setSelectedCard(card); setDeleteCardOpen(true); }, []);

  const [archiveOpen, setArchiveOpen] = useState(false);
  const [prioritiesOpen, setPrioritiesOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);

  useEffect(() => {
    if (!envId) return

    async function load() {
      try {
        const user = await userService.getMe()
        setCurrentUserId(user.id)

        const response = await loadEnvironment(Number(envId))
        setEnvObject(organizeEnv(response))
      } catch (e) {
        toast.error(msgErro(e))
      }
    }

    load()
  }, [envId])

  const handleCreateColumn = async (label: string) => {
    try {
      const column: ColumnCreateType = { label: label }
      const newColumn = await ColumnCRUD.create(envObject.id, column)
      setEnvObject(prev => ({
        ...prev,
        columns: [...prev.columns, newColumn],
      }));
    } catch(e) {
      toast.error(msgErro(e))
    }
  }

  const handleDeleteColumn = async (columnId: number) => {
    const deletedColumn = envObject.columns.find((item) => item.id === columnId)
    if(!deletedColumn) {
      toast.error("Coluna não existe")
      return
    }

    const hasCards = [...envObject.cards].some(c => c.column === deletedColumn.id)
    if (hasCards) {
      toast.error('Essa coluna ainda tem cards')
      return
    }

    try {
      const newEnvColumns: ColumnEnv[] = await ColumnCRUD.delete(deletedColumn.id)
      setEnvObject(prev => ({ ...prev, columns: newEnvColumns }));
    } catch(e) {
      toast.error(msgErro(e))
    }
  }

  const handleEditColumn = async (columnId: number, newLabel: string) => {
    const column = envObject.columns.find((item) => item.id === columnId)
    if (!column) return

    try {
      const savedColumn = await ColumnCRUD.edit(column.id, { ...column, label: newLabel })
      setEnvObject((prev) => ({
        ...prev,
        columns: prev.columns.map((item) => item.id === savedColumn.id ? savedColumn : item),
      }))
    } catch (e) {
       toast.error(msgErro(e))
    }
  }

  const handleCreateCard = async (newCard: Partial<CardEnv>) => {
    try {
      const card = await CardCRUD.create(envObject.id, newCard)
      setEnvObject(prev => ({ ...prev, cards: [...prev.cards, card] }))
    } catch (e) {
      toast.error(msgErro(e))
    }
  }

  const handleEditCard = async (updated: CardEnv) => {
    try {
      const saved: CardEnv = await CardCRUD.edit(updated.id, updated)
      setEnvObject(prev => ({
        ...prev,
        cards: prev.cards.map(c => c.id === saved.id ? saved : c),
      }))
    } catch (e) {
      toast.error(msgErro(e))
    }
  }

  const handleArchiveCard = async (card: CardEnv) => {
    try {
      const archivedCard = { ...card, archived: true }
      const newCards = await CardCRUD.archive(card.id, archivedCard)

      setEnvObject(prev => ({
        ...prev,
        cards: newCards.filter(c => !c.archived),
        archive: newCards.filter(c => c.archived),
      }));

      api?.exec("delete-card", { id: card.id });
    } catch(e) {
      toast.error(msgErro(e))
    }
  };

  const handleRestoreCard = async (card: CardEnv) => {
    if (envObject.columns.length === 0) {
      toast.error("Crie uma coluna antes de restaurar o card.")
      return
    }

    const columnId = envObject.columns.some((c) => c.id === card.column)
      ? card.column
      : envObject.columns[0].id

    const restoredCard: CardEnv = { ...card, archived: false, column: columnId }

    try {
      const newCards: CardEnv[] = await CardCRUD.archive(card.id, restoredCard)
      setEnvObject((prev) => ({
        ...prev,
        cards: newCards.filter(c => !c.archived),
        archive: newCards.filter(c => c.archived),
      }))
    } catch (e) {
      toast.error(msgErro(e))
    }
  }

  const handleDeleteForever = async (card: CardEnv) => {
    try {
      await CardCRUD.delete(card.id)
      setEnvObject(prev => ({ ...prev, archive: prev.archive.filter(c => c.id !== card.id) }));
    } catch(e) {
      toast.error(msgErro(e))
    }
  };

  useEffect(() => {
    if (!api) return

    api.on("move-card", async ({ id, column, before }: any) => {
      try {
        const newCards: CardEnv[] = await CardCRUD.move(id, { column, before })
        setEnvObject(prev => ({ 
          ...prev, 
          cards: newCards.filter(c => !c.archived),
          archive: newCards.filter(c => c.archived) 
        }))
      } catch (e) {
        toast.error(msgErro(e))
        setEnvObject(prev => ({ ...prev, cards: [...prev.cards] }))
      }
    })
  }, [api])

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

  const handleCreatePriority = async ({ label, css }: Omit<PriorityEnv, 'id'>) => {
    try {
      const newPriority = await PriorityCRUD.create(envObject.id, { label, css })
      setEnvObject(prev => ({ ...prev, priority: [...prev.priority, newPriority] }));
    } catch(e) {
      toast.error(msgErro(e))
    }
  };

  const handleEditPriority = async (updated: PriorityEnv) => {
    try {
      const newPriority = await PriorityCRUD.edit(updated.id, updated)
      setEnvObject(prev => ({
        ...prev,
        priority: prev.priority.map(p => p.id === newPriority.id ? newPriority : p),
      }));
    } catch(e) {
      toast.error(msgErro(e))
    }
  };

  const handleDeletePriority = async (priority: PriorityEnv) => {
    try {
      await PriorityCRUD.delete(priority.id)
      const clear = (c: CardEnv) => c.priority === priority.id ? { ...c, priority: undefined } : c

      setEnvObject(prev => ({
        ...prev,
        priority: prev.priority.filter(p => p.id !== priority.id),
        cards: prev.cards.map(clear),
        archive: prev.archive.map(clear),
      }))
    } catch (e) {
      toast.error(msgErro(e))
    }
  }

  const handleAddUser = async (email: string) => {
    try {
      const user = await userService.findByEmail(email);
      if (envObject.users.some(u => u.id === user.id)) {
        toast.error('Esse usuário já faz parte do ambiente');
        return
      }
      const newUser = await addUserEnvironment(envObject.id, user.id)
      setEnvObject(prev => ({ ...prev, users: [...prev.users, newUser] }));
    } catch(e) {
      toast.error(msgErro(e))
    }
  };

  const handleRemoveUser = async (user: userEnv) => {
    try {
      await deleteUserEnvironment(envObject.id, user.id)
      const clear = (c: CardEnv) =>
        c.users?.includes(user.id) ? { ...c, users: c.users.filter(id => id !== user.id) } : c

      setEnvObject(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== user.id),
        cards: prev.cards.map(clear),
        archive: prev.archive.map(clear),
      }))
    } catch (e) {
      toast.error(msgErro(e))
    }
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      bgcolor: 'background.default',
      color: 'text.primary',
      overflow: 'hidden' 
    }}>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItem: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: 1.5,
          bgcolor: 'background.paper',
          borderRadius: 0,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="primary.main">
            {envObject.name || 'Carregando Ambiente...'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {envObject.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="contained" size="small" onClick={() => setCreateCardOpen(true)}>+ Criar Card</Button>
          <Button variant="outlined" size="small" onClick={() => setCreateOpen(true)}>Nova Coluna</Button>
          <Button variant="outlined" size="small" color="inherit" onClick={() => setEditOpen(true)}>Editar Coluna</Button>
          <Button variant="outlined" size="small" color="error" onClick={() => setDeleteOpen(true)}>Deletar Coluna</Button>
          
          <Divider orientation="vertical" flexItem />

          <Button variant="text" size="small" onClick={() => setPrioritiesOpen(true)}>Prioridades</Button>

          {currentUserId === envObject.owner && (
            <Button variant="text" size="small" onClick={() => setUsersOpen(true)}>Usuários</Button>
          )}

          <Button variant="contained" color="secondary" size="small" onClick={() => setArchiveOpen(true)}>
            Arquivados ({envObject.archive.length})
          </Button>
        </Box>
      </Paper>

    <Box sx={{ flex: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', width: '100%' }}>
      <WillowDark>
        <Box sx={{ width: '1000px', height: '100%', display: 'flex', justifyContent: 'center' }}>
          <Kanban 
            init={setApi} 
            cards={envObject.cards} 
            columns={envObject.columns} 
            cardContent={CardContent} 
          />
        </Box>
      </WillowDark>
    </Box>

      <EditCardForm
        open={editCardOpen} card={selectedCard}
        columns={envObject.columns} priorities={envObject.priority} users={envObject.users}
        onClose={() => setEditCardOpen(false)} onSubmit={handleEditCard}
      />
      <DeleteCardForm
        open={deleteCardOpen} card={selectedCard}
        onClose={() => setDeleteCardOpen(false)} onConfirm={handleArchiveCard}
      />
      <CreateColumnForm open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreateColumn}/>
      <DeleteColumnForm columns={envObject.columns} open={deleteOpen} onClose={() => setDeleteOpen(false)} onSubmit={handleDeleteColumn}/>
      <EditColumnForm columns={envObject.columns} open={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEditColumn}/>
      <CreateCardForm columns={envObject.columns} prioritys={envObject.priority} users={envObject.users} open={createCardOpen} onClose={() => setCreateCardOpen(false)} onSubmit={handleCreateCard}/>
      
      <ManagePriorityDialog
        open={prioritiesOpen}
        onClose={() => setPrioritiesOpen(false)}
        priorities={envObject.priority}
        cards={envObject.cards}
        onCreate={handleCreatePriority}
        onEdit={handleEditPriority}
        onDelete={handleDeletePriority}
      />

      {currentUserId === envObject.owner && (
        <ManageUserDialog
          open={usersOpen}
          onClose={() => setUsersOpen(false)}
          users={envObject.users}
          cards={envObject.cards}
          onAdd={handleAddUser}
          onRemove={handleRemoveUser}
        />
      )}

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
  );
}

export default KanbanEnvironment;