import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { personalInfoService } from '@api/personalInfoService';

interface PersonalInfoFormProps {
  profileId: number;
  onSaveSuccess?: () => void;
}

interface PersonalInfoFormData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  professional_title: string;
  summary: string;
}

const schema = yup.object({
  full_name: yup.string().required('common.nameRequired'),
  email: yup.string().email('auth.emailInvalid').required('auth.emailRequired'),
  phone: yup.string().required('personalInfo.phoneRequired'),
  location: yup.string().required('personalInfo.locationRequired'),
  professional_title: yup.string().default(''),
  summary: yup.string().default(''),
});

const PersonalInfoForm = ({ profileId, onSaveSuccess }: PersonalInfoFormProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalInfoFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      professional_title: '',
      summary: '',
    },
  });

  // Load personal info
  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const data = await personalInfoService.getPersonalInfo(profileId);
        reset({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          professional_title: data.professional_title || '',
          summary: data.summary || '',
        });
      } catch (err: any) {
        // If personal info doesn't exist yet (404), just show empty form
        if (err.response?.status === 404) {
          reset({
            full_name: '',
            email: '',
            phone: '',
            location: '',
            professional_title: '',
            summary: '',
          });
        } else {
          setErrorMessage(err.response?.data?.message || t('common.error'));
        }
      } finally {
        setLoading(false);
      }
    };

    loadPersonalInfo();
  }, [profileId, reset, t]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      setSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      await personalInfoService.updatePersonalInfo(profileId, data);
      setSuccessMessage(t('profile.saveSuccess'));
      onSaveSuccess?.();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('profile.saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="full_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('personalInfo.fullName')}
                error={!!errors.full_name}
                helperText={errors.full_name ? t(errors.full_name.message as string) : ''}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('personalInfo.email')}
                type="email"
                error={!!errors.email}
                helperText={errors.email ? t(errors.email.message as string) : ''}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('personalInfo.phone')}
                error={!!errors.phone}
                helperText={errors.phone ? t(errors.phone.message as string) : ''}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('personalInfo.location')}
                error={!!errors.location}
                helperText={errors.location ? t(errors.location.message as string) : ''}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="professional_title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('personalInfo.professionalTitle')}
                placeholder={t('personalInfo.professionalTitlePlaceholder')}
                error={!!errors.professional_title}
                helperText={errors.professional_title ? t(errors.professional_title.message as string) : ''}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="summary"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={4}
                label={t('personalInfo.summary')}
                placeholder={t('personalInfo.summaryPlaceholder')}
                error={!!errors.summary}
                helperText={errors.summary ? t(errors.summary.message as string) : ''}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              {saving ? t('common.saving') : t('common.save')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoForm;
