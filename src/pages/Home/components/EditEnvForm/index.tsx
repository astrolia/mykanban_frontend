import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import type { Workspace, UpdateWorkspaceType } from '../../../../types/REMOVERworkspace' // ajuste o caminho

interface EditEnvFormProps {
  workspace: Workspace
  onSubmit: (data: UpdateWorkspaceType) => void
  onCancel: () => void
}

function EditEnvForm({ workspace, onSubmit, onCancel }: EditEnvFormProps) {
  const [name, setName] = useState(workspace.name)
  const [description, setDescription] = useState(workspace.description)
  const [priorities, setPriorities] = useState<string[]>(workspace.priorities)
  const [newPriority, setNewPriority] = useState('')
  const [errName, setErrName] = useState('')

  function addPriority() {
    const value = newPriority.trim()
    if (!value) return

    const exists = priorities.some((p) => p.toLowerCase() === value.toLowerCase())
    if (!exists) setPriorities((prev) => [...prev, value])
    setNewPriority('')
  }

  function removePriority(value: string) {
    setPriorities((prev) => prev.filter((p) => p !== value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setErrName('Nome é obrigatório')
      return
    }

    setErrName('')
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      priorities,
    })
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
    >
      <Typography variant='h5'>Editar ambiente</Typography>

      <TextField
        label='Nome do ambiente'
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!errName}
        helperText={errName}
        required
        fullWidth
      />

      <TextField
        label='Descrição'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        fullWidth
      />

      {/* prioridades */}
      <Typography variant='subtitle1'>Prioridades</Typography>

      <Stack direction='row' spacing={1}>
        <TextField
          label='Nova prioridade'
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          onKeyDown={(e) => {
            // Enter adiciona a prioridade em vez de enviar o formulário
            if (e.key === 'Enter') {
              e.preventDefault()
              addPriority()
            }
          }}
          size='small'
          fullWidth
        />
        <Button type='button' variant='outlined' onClick={addPriority}>
          Adicionar
        </Button>
      </Stack>

      {priorities.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          Nenhuma prioridade adicionada.
        </Typography>
      ) : (
        <Stack direction='row' spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {priorities.map((p) => (
            <Chip key={p} label={p} onDelete={() => removePriority(p)} />
          ))}
        </Stack>
      )}

      <Stack direction='row' spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button type='button' onClick={onCancel}>
          Cancelar
        </Button>
        <Button type='submit' variant='contained'>
          Salvar
        </Button>
      </Stack>
    </Box>
  )
}

export default EditEnvForm