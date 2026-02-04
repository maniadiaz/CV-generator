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
  Grid,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  EmojiObjects as SkillsIcon,
  Language as LanguageIcon,
  CardMembership as CertificateIcon,
  Group as SocialIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { fetchProfileById, updateProfileCompletion } from '@redux/slices/profileSlice';
import PersonalInfoForm from '@components/profile/PersonalInfoForm';
import SectionCard from '@components/profile/SectionCard';
import ProfileCompletionCard from '@components/profile/ProfileCompletionCard';

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
      <ProfileCompletionCard
        completionPercentage={currentProfile.completion_percentage || 0}
      />

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

      {/* CV Sections Cards */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        {t('profile.cvSections')}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SectionCard
            title={t('experience.title')}
            description={t('experience.sectionDescription')}
            icon={WorkIcon}
            path={`/profiles/${id}/experience`}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SectionCard
            title={t('education.title')}
            description={t('education.sectionDescription')}
            icon={SchoolIcon}
            path={`/profiles/${id}/education`}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SectionCard
            title={t('skills.title')}
            description={t('skills.sectionDescription')}
            icon={SkillsIcon}
            path={`/profiles/${id}/skills`}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SectionCard
            title={t('languages.title')}
            description={t('languages.sectionDescription')}
            icon={LanguageIcon}
            path={`/profiles/${id}/languages`}
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SectionCard
            title={t('certificates.title')}
            description={t('certificates.sectionDescription')}
            icon={CertificateIcon}
            path={`/profiles/${id}/certifications`}
            color="secondary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SectionCard
            title={t('socialNetworks.title')}
            description={t('socialNetworks.sectionDescription')}
            icon={SocialIcon}
            path={`/profiles/${id}/social-networks`}
            color="primary"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileEdit;
