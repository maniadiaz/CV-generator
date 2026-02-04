import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { register as registerAction, checkAuth } from '@redux/slices/authSlice';
import type { RegisterData } from '@app-types/index';

interface RegisterFormData extends RegisterData {
  confirmPassword: string;
}

const schema = yup.object({
  first_name: yup.string().required('auth.firstNameRequired'),
  last_name: yup.string().required('auth.lastNameRequired'),
  email: yup
    .string()
    .email('auth.emailInvalid')
    .required('auth.emailRequired'),
  password: yup
    .string()
    .min(8, 'auth.passwordMin')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'auth.passwordRequirements'
    )
    .required('auth.passwordRequired'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'auth.passwordsMustMatch')
    .required('auth.confirmPasswordRequired'),
});

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
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
          // Token is invalid, user stays on register page
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

  // Countdown and redirect after successful registration
  useEffect(() => {
    if (registrationSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (registrationSuccess && countdown === 0) {
      navigate('/login');
    }
  }, [registrationSuccess, countdown, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      // Exclude confirmPassword from the data sent to the backend
      const { confirmPassword, ...registerData } = data;
      await dispatch(registerAction(registerData)).unwrap();
      // Show success message and start countdown (handled by useEffect)
      setRegistrationSuccess(true);
    } catch (err: any) {
      setError(err || t('auth.registerError'));
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
            {t('auth.register')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {registrationSuccess && (
            <>
              <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                {t('auth.registerSuccess')}. {t('auth.checkEmailToVerify')}
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                {t('auth.redirectingToLogin', { seconds: countdown })}
              </Typography>
            </>
          )}

          {!registrationSuccess && (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  label={t('common.firstName')}
                  autoComplete="given-name"
                  autoFocus
                  error={!!errors.first_name}
                  helperText={errors.first_name ? t(errors.first_name.message as string) : ''}
                />
              )}
            />

            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  label={t('common.lastName')}
                  autoComplete="family-name"
                  error={!!errors.last_name}
                  helperText={errors.last_name ? t(errors.last_name.message as string) : ''}
                />
              )}
            />

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
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password ? t(errors.password.message as string) : ''}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  label={t('common.confirmPassword')}
                  type="password"
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword ? t(errors.confirmPassword.message as string) : ''}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : t('auth.register')}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                {t('auth.alreadyHaveAccount')} {t('auth.login')}
              </Link>
            </Box>
          </Box>
          )}

          {registrationSuccess && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                {t('auth.goToLogin')}
              </Link>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
