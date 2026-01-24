import { useState } from 'react';
import { useCV } from '../context/CVContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import { EmojiEvents, Add, Close } from '@mui/icons-material';

export function Skills() {
  const { currentProfile, addSkill, deleteSkill } = useCV();
  const [newSkill, setNewSkill] = useState('');

  if (!currentProfile) {
    return <Box sx={{ p: 4 }}>Cargando...</Box>;
  }

  const handleAdd = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const suggestedSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
    'Java', 'SQL', 'Git', 'Docker', 'AWS', 'Agile/Scrum',
    'Liderazgo', 'Comunicación', 'Trabajo en equipo'
  ].filter(skill => !currentProfile.skills?.includes(skill));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} color="white">
          Habilidades
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
          Agrega tus competencias técnicas y blandas
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              label="Nueva Habilidad"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Ej: React, Liderazgo, Python..."
              onKeyPress={handleKeyPress}
            />
            <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ minWidth: 120 }}>
              Agregar
            </Button>
          </Box>

          {suggestedSkills.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Sugerencias:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {suggestedSkills.slice(0, 8).map((skill) => (
                  <Chip
                    key={skill}
                    label={`+ ${skill}`}
                    onClick={() => addSkill(skill)}
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'primary.light', color: 'white' }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <EmojiEvents color="primary" />
            <Typography variant="h6">
              Tus Habilidades ({currentProfile.skills?.length || 0})
            </Typography>
          </Box>

          {currentProfile.skills?.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <EmojiEvents sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
              <Typography color="text.secondary">No has agregado habilidades aún</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {currentProfile.skills?.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => deleteSkill(index)}
                  color="primary"
                  variant="filled"
                  sx={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
