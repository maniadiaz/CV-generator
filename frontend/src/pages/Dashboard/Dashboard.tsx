import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { fetchProfiles } from '@redux/slices/profileSlice';
import ProfileList from './ProfileList';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profiles, loading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const totalProfiles = profiles.length;
  const avgCompletion = totalProfiles > 0
    ? Math.round(profiles.reduce((sum, p) => sum + p.completionPercentage, 0) / totalProfiles)
    : 0;

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

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
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
          </Grid>

          <Grid item xs={12} md={4}>
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
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('dashboard.totalExports')}
                </Typography>
                <Typography variant="h3" color="primary">
                  0
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <ProfileList />
    </>
  );
};

export default Dashboard;
