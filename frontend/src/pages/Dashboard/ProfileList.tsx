import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { fetchProfiles, deleteProfile } from '@redux/slices/profileSlice';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import CreateProfileDialog from '@components/profile/CreateProfileDialog';

const ProfileList = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profiles, loading } = useAppSelector((state) => state.profile);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const dateLocale = i18n.language === 'es' ? es : enUS;

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const handleCreateProfile = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleEditProfile = (id: number) => {
    navigate(`/profiles/${id}/edit`);
  };

  const handlePreviewProfile = (id: number) => {
    // Redirect to templates-export page where user can preview and download CV
    navigate(`/profiles/${id}/templates-export`);
  };

  const handleDeleteClick = (id: number) => {
    setProfileToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (profileToDelete) {
      await dispatch(deleteProfile(profileToDelete));
      setDeleteDialogOpen(false);
      setProfileToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProfileToDelete(null);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">{t('dashboard.myProfiles')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateProfile}
        >
          {t('profile.newProfile')}
        </Button>
      </Box>

      {!profiles || profiles.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('dashboard.noProfiles')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('dashboard.createFirstProfile')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateProfile}
            >
              {t('profile.newProfile')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {Array.isArray(profiles) && profiles.map((profile) => (
            <Grid key={profile.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" noWrap>
                      {profile.name}
                    </Typography>
                    {profile.is_default && (
                      <Chip label={t('profile.default')} size="small" color="primary" />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {profile.template}
                  </Typography>

                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('profile.completion')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profile.completion_percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={profile.completion_percentage}
                      color={getCompletionColor(profile.completion_percentage)}
                    />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Chip
                      label={`${profile.download_count} ${t('profile.downloads')}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    {t('profile.lastUpdated')}: {format(new Date(profile.updated_at), 'PPp', { locale: dateLocale })}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditProfile(profile.id)}
                      title={t('profile.editProfile')}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => handlePreviewProfile(profile.id)}
                      title={t('profile.preview')}
                    >
                      <PreviewIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(profile.id)}
                      title={t('profile.deleteProfile')}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <CreateProfileDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>{t('profile.deleteProfile')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('profile.deleteConfirm')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfileList;