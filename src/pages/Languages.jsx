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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Language as LanguageIcon, Add, Delete } from '@mui/icons-material';

const levelOptions = [
  { value: 'Básico', label: 'Básico' },
  { value: 'Intermedio', label: 'Intermedio' },
  { value: 'Avanzado', label: 'Avanzado' },
  { value: 'Nativo', label: 'Nativo' },
  { value: 'C2 - Maestría', label: 'C2 - Maestría' },
  { value: 'C1 - Avanzado', label: 'C1 - Avanzado' },
  { value: 'B2 - Intermedio Alto', label: 'B2 - Intermedio Alto' },
  { value: 'B1 - Intermedio', label: 'B1 - Intermedio' },
  { value: 'A2 - Elemental', label: 'A2 - Elemental' },
  { value: 'A1 - Principiante', label: 'A1 - Principiante' },
];

export function Languages() {
  const { currentProfile, addLanguage, deleteLanguage } = useCV();
  const [formData, setFormData] = useState({ name: '', level: '' });

  if (!currentProfile) {
    return <Box sx={{ p: 4 }}>Cargando...</Box>;
  }

  const handleAdd = () => {
    if (formData.name && formData.level) {
      addLanguage(formData);
      setFormData({ name: '', level: '' });
    }
  };

  const commonLanguages = [
    'Español', 'Inglés', 'Francés', 'Alemán', 'Portugués',
    'Italiano', 'Chino Mandarín', 'Japonés', 'Coreano', 'Árabe'
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} color="white">
          Idiomas
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
          Indica los idiomas que dominas
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Agregar Idioma</Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Idioma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Inglés"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Nivel</InputLabel>
                <Select
                  value={formData.level}
                  label="Nivel"
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  {levelOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                onClick={handleAdd}
                disabled={!formData.name || !formData.level}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Idiomas comunes:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {commonLanguages
                .filter(lang => !currentProfile.languages?.some(l => l.name === lang))
                .slice(0, 6)
                .map((lang) => (
                  <Chip
                    key={lang}
                    label={lang}
                    onClick={() => setFormData({ ...formData, name: lang })}
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'primary.light', color: 'white' }
                    }}
                  />
                ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <LanguageIcon color="primary" />
            <Typography variant="h6">
              Tus Idiomas ({currentProfile.languages?.length || 0})
            </Typography>
          </Box>

          {currentProfile.languages?.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LanguageIcon sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
              <Typography color="text.secondary">No has agregado idiomas aún</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {currentProfile.languages?.map((lang) => (
                <Box
                  key={lang.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(236,72,153,0.1) 100%)',
                  }}
                >
                  <Box>
                    <Typography fontWeight={700}>{lang.name}</Typography>
                    <Typography variant="body2" color="primary">
                      {lang.level}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => deleteLanguage(lang.id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
