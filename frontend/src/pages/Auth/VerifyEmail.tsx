import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { authService } from '@api/authService';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError(t('auth.verificationLinkInvalid'));
        setVerifying(false);
        return;
      }

      try {
        await authService.verifyEmail(token);
        setSuccess(true);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || t('auth.emailVerificationError'));
        setSuccess(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token, t]);

  // Countdown and redirect after successful verification
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
    <Container component="main" maxWidth="sm">
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
          {verifying && (
            <>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {t('auth.verifyingEmail')}
              </Typography>
            </>
          )}

          {!verifying && success && (
            <>
              <SuccessIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                {t('auth.emailVerificationSuccess')}
              </Typography>
              <Alert severity="success" sx={{ width: '100%', mt: 2, mb: 3 }}>
                {t('auth.emailVerified')}
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {t('auth.redirectingToLogin', { seconds: countdown })}
              </Typography>
            </>
          )}

          {!verifying && error && (
            <>
              <ErrorIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                {t('auth.emailVerificationError')}
              </Typography>
              <Alert severity="error" sx={{ width: '100%', mt: 2, mb: 3 }}>
                {error}
              </Alert>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
              >
                {t('auth.goToLogin')}
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
