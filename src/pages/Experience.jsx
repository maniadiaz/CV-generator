import { useState } from 'react';
import { useCV } from '../context/CVContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Work, Add, Delete, Edit, Close, Check } from '@mui/icons-material';

export function Experience() {
  const { currentProfile, addExperience, updateExperience, deleteExperience } = useCV();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  if (!currentProfile) {
    return <Box sx={{ p: 4 }}>Cargando...</Box>;
  }

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
  };

  const handleAdd = () => {
    if (formData.company && formData.position) {
      addExperience({
        ...formData,
        endDate: formData.current ? 'Presente' : formData.endDate
      });
      resetForm();
      setIsAdding(false);
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company,
      position: exp.position,
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate === 'Presente' ? '' : exp.endDate || '',
      current: exp.endDate === 'Presente',
      description: exp.description || ''
    });
  };

  const handleUpdate = () => {
    updateExperience(editingId, {
      ...formData,
      endDate: formData.current ? 'Presente' : formData.endDate
    });
    resetForm();
    setEditingId(null);
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
  };

  const ExperienceForm = ({ onSave, onCancel }) => (
    <Card sx={{ border: '2px solid', borderColor: 'primary.light' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Empresa"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Nombre de la empresa"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Cargo"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Desarrollador Senior"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Ubicación"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ciudad, País"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Fecha Inicio"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              placeholder="Ene 2020"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Fecha Fin"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              placeholder="Dic 2023"
              disabled={formData.current}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                />
              }
              label="Trabajo actual"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Descripción de responsabilidades (una por línea)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Desarrollo de aplicaciones web con React
Liderazgo de equipo de 5 personas
Implementación de CI/CD"
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={onCancel} startIcon={<Close />}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={onSave} startIcon={<Check />}>
            Guardar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="white">
            Experiencia Laboral
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
            Agrega tu historial de trabajo
          </Typography>
        </Box>
        {!isAdding && !editingId && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setIsAdding(true)}>
            Agregar Experiencia
          </Button>
        )}
      </Box>

      {isAdding && <ExperienceForm onSave={handleAdd} onCancel={handleCancel} />}

      {currentProfile.experience?.length === 0 && !isAdding && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Work sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay experiencias agregadas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Haz clic en "Agregar Experiencia" para comenzar
            </Typography>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {currentProfile.experience?.map((exp) => (
          <Box key={exp.id}>
            {editingId === exp.id ? (
              <ExperienceForm onSave={handleUpdate} onCancel={handleCancel} />
            ) : (
              <Card sx={{ '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.3s' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Work color="primary" />
                        <Typography variant="h6" fontWeight={700}>
                          {exp.company}
                        </Typography>
                      </Box>
                      <Typography color="primary" fontWeight={500} sx={{ mt: 0.5 }}>
                        {exp.position}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exp.location && `${exp.location} • `}
                        {exp.startDate} - {exp.endDate || 'Presente'}
                      </Typography>
                      {exp.description && (
                        <List dense sx={{ mt: 1 }}>
                          {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                            <ListItem key={idx} sx={{ py: 0, pl: 0 }}>
                              <ListItemText
                                primary={`• ${line}`}
                                primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleEdit(exp)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => deleteExperience(exp.id)} color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
