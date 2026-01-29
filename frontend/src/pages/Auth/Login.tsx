import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { login, checkAuth } from '@redux/slices/authSlice';
import type { LoginCredentials } from '@app-types/index';

const schema = yup.object({
  email: yup
    .string()
    .email('auth.emailInvalid')
    .required('auth.emailRequired'),
  password: yup
    .string()
    .min(8, 'auth.passwordMin')
    .required('auth.passwordRequired'),
});

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Check if user is already authenticated
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await dispatch(checkAuth()).unwrap();
          navigate('/dashboard');
        } catch (err) {
          // Token is invalid, user stays on login page
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
    };

    verifyToken();
  }, [dispatch, navigate]);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError(null);
      const result = await dispatch(login(data)).unwrap();
      if (result) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err || t('auth.loginError'));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            {t('auth.login')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  label={t('common.email')}
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email ? t(errors.email.message as string) : ''}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  label={t('common.password')}
                  type="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password ? t(errors.password.message as string) : ''}
                />
              )}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                {t('auth.forgotPassword')}
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : t('auth.login')}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                {t('auth.dontHaveAccount')} {t('auth.register')}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
