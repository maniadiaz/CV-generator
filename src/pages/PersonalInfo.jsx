import { useCV } from '../context/CVContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  Alert,
} from '@mui/material';
import { Person, Share, Public, Delete } from '@mui/icons-material';

export function PersonalInfo() {
  const { currentProfile, updatePersonalInfo, renameProfile, deleteProfile, profiles, currentProfileId } = useCV();

  if (!currentProfile) {
    return <Box sx={{ p: 4 }}>Cargando...</Box>;
  }

  const { personalInfo } = currentProfile;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="white">
            Datos Personales
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
            Información básica para tu CV
          </Typography>
        </Box>
        {profiles.length > 1 && (
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={() => deleteProfile(currentProfileId)}
          >
            Eliminar Perfil
          </Button>
        )}
      </Box>

      {/* Nombre del Perfil */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Person color="primary" />
            <Typography variant="h6">Nombre del Perfil</Typography>
          </Box>
          <TextField
            fullWidth
            label="Nombre para identificar este perfil"
            value={currentProfile.name || ''}
            onChange={(e) => renameProfile(currentProfileId, e.target.value)}
            placeholder="Ej: Mi CV Principal"
          />
        </CardContent>
      </Card>

      {/* Información Personal */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Person color="primary" />
            <Typography variant="h6">Información Personal</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nombre Completo"
                value={personalInfo.fullName || ''}
                onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                placeholder="Juan Pérez García"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                value={personalInfo.email || ''}
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                placeholder="juan@email.com"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Teléfono"
                value={personalInfo.phone || ''}
                onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Dirección"
                value={personalInfo.address || ''}
                onChange={(e) => updatePersonalInfo({ address: e.target.value })}
                placeholder="Calle Principal 123"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Ciudad"
                value={personalInfo.city || ''}
                onChange={(e) => updatePersonalInfo({ city: e.target.value })}
                placeholder="Ciudad de México"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="País"
                value={personalInfo.country || ''}
                onChange={(e) => updatePersonalInfo({ country: e.target.value })}
                placeholder="México"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Redes Sociales */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Share color="primary" />
            <Typography variant="h6">Redes Sociales y Links</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="LinkedIn"
                value={personalInfo.linkedin || ''}
                onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/usuario"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="GitHub"
                value={personalInfo.github || ''}
                onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                placeholder="github.com/usuario"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Twitter/X"
                value={personalInfo.twitter || ''}
                onChange={(e) => updatePersonalInfo({ twitter: e.target.value })}
                placeholder="@usuario"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Portafolio Personal"
                value={personalInfo.portfolio || ''}
                onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
                placeholder="www.miportafolio.com"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Resumen Profesional */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Public color="primary" />
            <Typography variant="h6">Resumen Profesional</Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Breve descripción de tu perfil profesional"
            value={personalInfo.summary || ''}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            placeholder="Profesional con X años de experiencia en..."
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Este resumen aparecerá al inicio de tu CV. Recomendamos 3-4 oraciones que destaquen tu experiencia y objetivos.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
