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
import ProfileList from './ProfileList';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profiles } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const totalProfiles = profiles.length;
  const avgCompletion = totalProfiles > 0
    ? Math.round(profiles.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / totalProfiles)
    : 0;
  const totalExports = profiles.reduce((sum, p) => sum + (p.download_count || 0), 0);

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t('common.welcome')}, {user?.first_name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('dashboard.title')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
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
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
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
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
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
        </Box>
      </Container>

      <ProfileList />
    </>
  );
};

export default Dashboard;