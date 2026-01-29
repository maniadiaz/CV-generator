import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { fetchProfileById, updateProfileCompletion } from '@redux/slices/profileSlice';
import PersonalInfoForm from '@components/profile/PersonalInfoForm';
import EducationForm from '@components/profile/EducationForm';
import ExperienceForm from '@components/profile/ExperienceForm';

const ProfileEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProfile, loading, error } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (id) {
      dispatch(fetchProfileById(Number(id)));
    }
  }, [dispatch, id]);

  const handleSaveSuccess = useCallback(() => {
    // Update only completion percentage without reloading entire profile
    if (id) {
      dispatch(updateProfileCompletion(Number(id)));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage < 30) return 'error';
    if (percentage < 70) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          {t('common.back')}
        </Button>
      </Container>
    );
  }

  if (!currentProfile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">{t('profile.notFound')}</Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          {t('common.back')}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<BackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            {t('common.back')}
          </Button>
          <Typography variant="h4">{currentProfile.name}</Typography>
        </Box>
      </Box>

      {/* Completion Progress Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('profile.completion')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={currentProfile.completion_percentage || 0}
                color={getCompletionColor(currentProfile.completion_percentage || 0)}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="h6" color="text.secondary">
              {currentProfile.completion_percentage || 0}%
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Personal Info Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('personalInfo.title')}
        </Typography>
        <PersonalInfoForm
          profileId={currentProfile.id}
          onSaveSuccess={handleSaveSuccess}
        />
      </Paper>

      {/* Experience Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('experience.title')}
        </Typography>
        <ExperienceForm
          profileId={currentProfile.id}
          onSaveSuccess={handleSaveSuccess}
        />
      </Paper>

      {/* Education Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('education.title')}
        </Typography>
        <EducationForm
          profileId={currentProfile.id}
          onSaveSuccess={handleSaveSuccess}
        />
      </Paper>
    </Container>
  );
};

export default ProfileEdit;
