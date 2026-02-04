import { useState } from 'react';
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
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Translate as LanguageIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Style as TemplateIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { logout } from '@redux/slices/authSlice';
import { toggleTheme } from '@redux/slices/themeSlice';
import { userStorage } from '@utils/userStorage';
import AppIconSvg from '../../assets/icon.svg';

interface MainLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const MainLayout = ({ children }: MainLayoutProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  // Obtener usuario desde localStorage o Redux
  const user = userStorage.getUser();

  // Construir nombre completo del usuario
  const userDisplayName = user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || t('common.user') || 'Usuario';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

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
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
          <Box
            component="img"
            src={AppIconSvg}
            alt="CV Generator"
            sx={{ width: 40 , height: 40 }}
          />
          <Typography variant="h6" noWrap component="div">
            CV Generator
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleToggleTheme}>
            <ListItemIcon>
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
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Box
              component="img"
              src={AppIconSvg}
              alt="CV Generator"
              sx={{
                width: 32,
                height: 32,
                display: location.pathname === '/dashboard' || location.pathname.includes('/profiles/') ? 'none' : 'block'
              }}
            />
            <Typography variant="h6" component="div">
              {location.pathname.includes('/profiles/') && location.pathname.includes('/edit')
                ? t('nav.editProfile')
                : location.pathname === '/dashboard'
                ? t('nav.dashboard')
                : 'CV Generator'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={t('common.language')}>
              <IconButton color="inherit" onClick={handleOpenLangMenu}>
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

            <Tooltip title={userDisplayName}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userDisplayName} sx={{ bgcolor: 'secondary.main' }}>
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
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
