import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { checkAuth } from '@redux/slices/authSlice';
import { lightTheme, darkTheme } from '@theme/theme';
import AppRoutes from '@routes/AppRoutes';
import PWAUpdatePrompt from '@components/common/PWAUpdatePrompt';
import '@i18n/config';

function App() {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <BrowserRouter>
          <AppRoutes />
          <PWAUpdatePrompt />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
