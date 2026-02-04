import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { authService } from '@api/authService';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const schema = yup.object({
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

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setError(null);
      if (!token) {
        setError(t('auth.resetPasswordError'));
        return;
      }

      await authService.resetPassword(token, data.password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.resetPasswordError'));
    }
  };

  // Countdown and redirect after successful reset
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate('/login');
    }
  }, [success, countdown, navigate]);

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
            {t('auth.resetPassword')}
          </Typography>

          {!success && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
              {t('auth.resetPasswordInstructions')}
            </Typography>
          )}

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <>
              <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                {t('auth.resetPasswordSuccess')}
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {t('auth.redirectingToLogin', { seconds: countdown })}
              </Typography>
            </>
          )}

          {!success && (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    fullWidth
                    label={t('auth.newPassword')}
                    type="password"
                    autoComplete="new-password"
                    autoFocus
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
                {isSubmitting ? <CircularProgress size={24} /> : t('auth.resetPassword')}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;
