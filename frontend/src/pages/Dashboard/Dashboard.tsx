import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { fetchProfiles } from '@redux/slices/profileSlice';
import { userStorage } from '@utils/userStorage';
import ProfileList from './ProfileList';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { profiles } = useAppSelector((state) => state.profile);

  // Obtener usuario desde localStorage o Redux
  const user = userStorage.getUser();

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const totalProfiles = profiles.length;
  const avgCompletion = totalProfiles > 0
    ? Math.round(profiles.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / totalProfiles)
    : 0;
  const totalExports = profiles.reduce((sum, p) => sum + (p.download_count || 0), 0);

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            {t('common.welcome')}, {user?.first_name || user?.name || t('common.user')}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('dashboard.title')}
          </Typography>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: { xs: 2, sm: 3 },
          mb: 4
        }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.totalProfiles')}
              </Typography>
              <Typography variant="h3" color="primary">
                {totalProfiles}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.avgCompletion')}
              </Typography>
              <Typography variant="h3" color="primary">
                {avgCompletion}%
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.totalExports')}
              </Typography>
              <Typography variant="h3" color="primary">
                {totalExports}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <ProfileList />
    </Box>
  );
};

export default Dashboard;