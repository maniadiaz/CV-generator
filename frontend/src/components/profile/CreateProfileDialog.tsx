import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { createProfile } from '@redux/slices/profileSlice';

interface CreateProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

interface CreateProfileFormData {
  name: string;
  template: string;
}

const schema = yup.object({
  name: yup.string().required('profile.profileNameRequired').min(3, 'profile.profileNameMin'),
  template: yup.string().required('profile.templateRequired'),
});

const CreateProfileDialog = ({ open, onClose }: CreateProfileDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      template: 'harvard_classic',
    },
  });

  const onSubmit = async (data: CreateProfileFormData) => {
    try {
      setError(null);
      const profile = await dispatch(createProfile(data)).unwrap();
      reset();
      onClose();
      // Redirect to edit page
      navigate(`/profiles/${profile.id}/edit`);
    } catch (err: any) {
      setError(err || t('profile.createError'));
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('profile.createNewProfile')}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t('profile.profileName')}
                placeholder={t('profile.profileNamePlaceholder')}
                error={!!errors.name}
                helperText={errors.name ? t(errors.name.message as string) : ''}
                autoFocus
                sx={{ mb: 3 }}
              />
            )}
          />

          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">{t('profile.selectTemplate')}</FormLabel>
            <Controller
              name="template"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="harvard_classic"
                    control={<Radio />}
                    label={
                      <Box>
                        <Box fontWeight="medium">{t('profile.templates.harvardClassic')}</Box>
                        <Box fontSize="0.875rem" color="text.secondary">
                          {t('profile.templates.harvardClassicDesc')}
                        </Box>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="harvard_modern"
                    control={<Radio />}
                    label={
                      <Box>
                        <Box fontWeight="medium">{t('profile.templates.harvardModern')}</Box>
                        <Box fontSize="0.875rem" color="text.secondary">
                          {t('profile.templates.harvardModernDesc')}
                        </Box>
                      </Box>
                    }
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : t('common.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProfileDialog;
