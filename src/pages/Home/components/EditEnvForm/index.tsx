import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import type { UpdateEnvironmentType, UserEnvironmentsType } from '../../../../types/EnvironmentType'

interface EditEnvFormProps {
  environment: UserEnvironmentsType
  onSubmit: (data: UpdateEnvironmentType) => void
  onCancel: () => void
}

function EditEnvForm({ environment, onSubmit, onCancel }: EditEnvFormProps) {
  const [name, setName] = useState(environment.name)
  const [description, setDescription] = useState(environment.description)
  const [errName, setErrName] = useState('')

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
