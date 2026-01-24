import { useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Button,
  Avatar,
} from '@mui/material';
import {
  Person,
  Work,
  School,
  EmojiEvents,
  Language,
  Description,
  Groups,
  Download,
  Upload,
  Add,
  Preview,
  Logout,
} from '@mui/icons-material';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

export function Sidebar() {
  const { profiles, currentProfileId, switchProfile, createProfile, exportData, importData } = useCV();
  const { user, logout } = useAuth();
  const fileInputRef = useRef(null);
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Person, label: 'Datos Personales' },
    { to: '/experience', icon: Work, label: 'Experiencia' },
    { to: '/education', icon: School, label: 'Educación' },
    { to: '/skills', icon: EmojiEvents, label: 'Habilidades' },
    { to: '/languages', icon: Language, label: 'Idiomas' },
    { to: '/certifications', icon: Description, label: 'Certificaciones' },
    { to: '/preview', icon: Preview, label: 'Vista Previa' },
  ];

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = importData(event.target?.result);
        if (!result) {
          alert('Error al importar datos. Verifica el formato del archivo.');
        }
      };
      reader.readAsText(file);
    }
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CV Generator
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Formato Harvard
        </Typography>
      </Box>

      {/* User Info */}
      {user && (
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Usuario'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Profile Selector */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Groups fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={500}>
            Perfil
          </Typography>
        </Box>
        <FormControl fullWidth size="small">
          <Select
            value={currentProfileId || ''}
            onChange={(e) => switchProfile(parseInt(e.target.value))}
          >
            {profiles.map((profile) => (
              <MenuItem key={profile.id} value={profile.id}>
                {profile.name || 'Sin nombre'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Add />}
          onClick={() => createProfile()}
          sx={{ mt: 1 }}
          size="small"
        >
          Nuevo Perfil
        </Button>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <ListItem key={to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={to}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.main' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'primary.main', minWidth: 40 }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Export/Import Actions */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Download />}
          onClick={exportData}
          sx={{ mb: 1 }}
          color="primary"
        >
          Exportar Datos
        </Button>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Upload />}
          onClick={() => fileInputRef.current?.click()}
        >
          Importar Datos
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </Box>

      {/* Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          variant="text"
          fullWidth
          startIcon={<Logout />}
          onClick={logout}
          color="error"
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Drawer>
  );
}
