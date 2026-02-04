import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Chip,
  alpha,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Translate as LanguageIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Style as TemplateIcon,
  Folder as FolderIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { logout } from '@redux/slices/authSlice';
import { toggleTheme } from '@redux/slices/themeSlice';
import { fetchProfiles } from '@redux/slices/profileSlice';
import { userStorage } from '@utils/userStorage';
import AppIconSvg from '../../assets/icon.svg';

interface MainLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 260;

const MainLayout = ({ children }: MainLayoutProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const { profiles } = useAppSelector((state) => state.profile);

  // Obtener usuario desde localStorage o Redux
  const user = userStorage.getUser();

  // Construir nombre completo del usuario
  const userDisplayName = user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || t('common.user') || 'Usuario';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const [profilesOpen, setProfilesOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    handleCloseLangMenu();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Extract profile ID from current path if present
  const profileIdMatch = location.pathname.match(/\/profiles\/(\d+)/);
  const currentProfileId = profileIdMatch ? profileIdMatch[1] : null;

  const menuItems = [
    { text: t('nav.dashboard'), icon: <DashboardIcon />, path: '/dashboard' },
    ...(currentProfileId
      ? [
          {
            text: t('nav.templatesAndExport'),
            icon: <TemplateIcon />,
            path: `/profiles/${currentProfileId}/templates-export`,
          },
        ]
      : []),
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2.5, py: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          width: '100%',
          transition: 'all 0.3s ease'
        }}>
          <Box
            component="img"
            src={AppIconSvg}
            alt="CV Generator"
            sx={{ 
              width: 42, 
              height: 42,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          />
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              fontWeight: 600,
              background: (theme) => theme.palette.mode === 'dark' 
                ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CV Generator
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flexGrow: 1, overflow: 'auto' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, transition: 'color 0.3s ease' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Sección de Mis Perfiles */}
        <ListItem disablePadding sx={{ mb: 0.5, mt: 2 }}>
          <ListItemButton
            onClick={() => setProfilesOpen(!profilesOpen)}
            sx={{
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText 
              primary={t('dashboard.myProfiles') || 'Mis Perfiles'}
              primaryTypographyProps={{
                fontWeight: 600,
              }}
            />
            {profilesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={profilesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {profiles && profiles.length > 0 ? (
              profiles.map((profile) => (
                <ListItem key={profile.id} disablePadding sx={{ pl: 2 }}>
                  <ListItemButton
                    onClick={() => handleNavigate(`/profiles/${profile.id}/edit`)}
                    selected={location.pathname === `/profiles/${profile.id}/edit`}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&.Mui-selected': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        borderLeft: (theme) => `3px solid ${theme.palette.primary.main}`,
                        '&:hover': {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                        },
                      },
                      '&:hover': {
                        bgcolor: 'action.hover',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <ListItemText 
                      primary={profile.name}
                      secondary={`${profile.completion_percentage}%`}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        noWrap: true,
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.75rem',
                      }}
                    />
                    <Chip
                      label={`${profile.completion_percentage}%`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: (theme) => 
                          profile.completion_percentage < 30 
                            ? alpha(theme.palette.error.main, 0.1)
                            : profile.completion_percentage < 70
                            ? alpha(theme.palette.warning.main, 0.1)
                            : alpha(theme.palette.success.main, 0.1),
                        color: (theme) =>
                          profile.completion_percentage < 30
                            ? theme.palette.error.main
                            : profile.completion_percentage < 70
                            ? theme.palette.warning.main
                            : theme.palette.success.main,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem sx={{ pl: 4 }}>
                <ListItemText 
                  primary={t('dashboard.noProfiles') || 'No hay perfiles'}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                  }}
                />
              </ListItem>
            )}
          </List>
        </Collapse>
      </List>
      <Divider />
      <List sx={{ px: 1.5, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleToggleTheme}
            sx={{
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText
              primary={mode === 'dark' ? t('common.lightMode') : t('common.darkMode')}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backdropFilter: 'blur(8px)',
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: { xs: 1, sm: 2 }, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexGrow: 1, minWidth: 0 }}>
            <Box
              component="img"
              src={AppIconSvg}
              alt="CV Generator"
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                display: location.pathname === '/dashboard' || location.pathname.includes('/profiles/') ? 'none' : 'block'
              }}
            />
            <Typography 
              variant="h6" 
              component="div"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {location.pathname.includes('/profiles/') && location.pathname.includes('/edit')
                ? t('nav.editProfile')
                : location.pathname === '/dashboard'
                ? t('nav.dashboard')
                : 'CV Generator'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <Tooltip title={t('common.language')} arrow>
              <IconButton 
                color="inherit" 
                onClick={handleOpenLangMenu}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElLang}
              open={Boolean(anchorElLang)}
              onClose={handleCloseLangMenu}
            >
              <MenuItem onClick={() => handleChangeLanguage('es')}>Español</MenuItem>
              <MenuItem onClick={() => handleChangeLanguage('en')}>English</MenuItem>
            </Menu>

            <Tooltip title={userDisplayName} arrow>
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ 
                  p: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Avatar 
                  alt={userDisplayName} 
                  sx={{ 
                    bgcolor: 'secondary.main',
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {userDisplayName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem disabled>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body1" fontWeight="bold" noWrap>
                    {userDisplayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                {t('auth.logout')}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
        <Box sx={{ p: 0, width: '100%', overflow: 'hidden' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
