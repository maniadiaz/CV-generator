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
} from '@mui/material';
import { School, Add, Delete, Edit, Close, Check } from '@mui/icons-material';

export function Education() {
  const { currentProfile, addEducation, updateEducation, deleteEducation } = useCV();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    description: ''
  });

  if (!currentProfile) {
    return <Box sx={{ p: 4 }}>Cargando...</Box>;
  }

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: ''
    });
  };

  const handleAdd = () => {
    if (formData.institution && formData.degree) {
      addEducation({
        ...formData,
        endDate: formData.current ? 'Presente' : formData.endDate
      });
      resetForm();
      setIsAdding(false);
    }
  };

  const handleEdit = (edu) => {
    setEditingId(edu.id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate === 'Presente' ? '' : edu.endDate || '',
      current: edu.endDate === 'Presente',
      gpa: edu.gpa || '',
      description: edu.description || ''
    });
  };

  const handleUpdate = () => {
    updateEducation(editingId, {
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

  const EducationForm = ({ onSave, onCancel }) => (
    <Card sx={{ border: '2px solid', borderColor: 'primary.light' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Institución"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="Universidad de Harvard"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Título"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              placeholder="Licenciatura, Maestría, etc."
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Campo de Estudio"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              placeholder="Ingeniería en Sistemas"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="GPA / Promedio"
              value={formData.gpa}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              placeholder="9.5/10"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Fecha Inicio"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              placeholder="2018"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Fecha Fin"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              placeholder="2022"
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
              label="Actualmente cursando"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción adicional (logros, proyectos, etc.)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tesis sobre inteligencia artificial..."
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="white">
            Educación
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
            Tu formación académica
          </Typography>
        </Box>
        {!isAdding && !editingId && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setIsAdding(true)}>
            Agregar Educación
          </Button>
        )}
      </Box>

      {isAdding && <EducationForm onSave={handleAdd} onCancel={handleCancel} />}

      {currentProfile.education?.length === 0 && !isAdding && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <School sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay educación agregada
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Haz clic en "Agregar Educación" para comenzar
            </Typography>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {currentProfile.education?.map((edu) => (
          <Box key={edu.id}>
            {editingId === edu.id ? (
              <EducationForm onSave={handleUpdate} onCancel={handleCancel} />
            ) : (
              <Card sx={{ '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.3s' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <School color="primary" />
                        <Typography variant="h6" fontWeight={700}>
                          {edu.institution}
                        </Typography>
                      </Box>
                      <Typography color="primary" fontWeight={500} sx={{ mt: 0.5 }}>
                        {edu.degree} {edu.field && `en ${edu.field}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {edu.startDate} - {edu.endDate || 'Presente'}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </Typography>
                      {edu.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {edu.description}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleEdit(edu)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => deleteEducation(edu.id)} color="error">
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
