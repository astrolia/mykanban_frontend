import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import type { CreateEnvironmentType } from "../../../../types/EnvironmentType";

interface CreateEnvFormProps {
  onSubmit: (dados: CreateEnvironmentType) => void;
}

function CreateEnvForm({ onSubmit }: CreateEnvFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errName, setErrName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrName("Nome é obrigatório");
      return;
    }

    setErrName("");
    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400, mx: "auto", mt: 4 }}
    >
      <Typography variant="h5">Novo ambiente</Typography>

      <TextField
        label="Nome do ambiente"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!errName}
        helperText={errName}
        required
        fullWidth
      />

      <TextField
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
        fullWidth
      />

      <Button type="submit" variant="contained">
        Criar ambiente
      </Button>
    </Box>
  );
}

export default CreateEnvForm;