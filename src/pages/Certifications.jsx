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
} from '@mui/material';
import { Description, Add, Delete, Close, Check } from '@mui/icons-material';

export function Certifications() {
  const { currentProfile, addCertification, deleteCertification } = useCV();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    date: '',
    credentialId: '',
    url: ''
  });

  if (!currentProfile) {
    return <Box sx={{ p: 4 }}>Cargando...</Box>;
  }

  const resetForm = () => {
    setFormData({ name: '', issuer: '', date: '', credentialId: '', url: '' });
  };

  const handleAdd = () => {
    if (formData.name) {
      addCertification(formData);
      resetForm();
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="white">
            Certificaciones
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
            Cursos y certificados relevantes
          </Typography>
        </Box>
        {!isAdding && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setIsAdding(true)}>
            Agregar Certificación
          </Button>
        )}
      </Box>

      {isAdding && (
        <Card sx={{ border: '2px solid', borderColor: 'primary.light' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Nueva Certificación</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nombre del Certificado"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="AWS Solutions Architect"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Organización Emisora"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="Amazon Web Services"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Fecha de Obtención"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="Marzo 2024"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="ID de Credencial"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  placeholder="ABC123XYZ"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="URL de Verificación"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button variant="outlined" onClick={handleCancel} startIcon={<Close />}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleAdd} startIcon={<Check />}>
                Guardar
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {currentProfile.certifications?.length === 0 && !isAdding && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Description sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay certificaciones agregadas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Haz clic en "Agregar Certificación" para comenzar
            </Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2}>
        {currentProfile.certifications?.map((cert) => (
          <Grid size={{ xs: 12, md: 6 }} key={cert.id}>
            <Card sx={{ '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.3s', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description color="primary" />
                      <Typography fontWeight={700}>{cert.name}</Typography>
                    </Box>
                    {cert.issuer && (
                      <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                        {cert.issuer}
                      </Typography>
                    )}
                    {cert.date && (
                      <Typography variant="body2" color="text.secondary">
                        {cert.date}
                      </Typography>
                    )}
                    {cert.credentialId && (
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                        ID: {cert.credentialId}
                      </Typography>
                    )}
                  </Box>
                  <IconButton onClick={() => deleteCertification(cert.id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
