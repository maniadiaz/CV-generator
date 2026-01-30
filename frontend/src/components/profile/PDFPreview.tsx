import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Visibility as PreviewIcon,
  CheckCircle as ValidIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { templatesService } from '@api/templatesService';
import type { ValidationResult } from '@app-types/index';
import { useTranslation } from 'react-i18next';

interface PDFPreviewProps {
  profileId: number;
}

export default function PDFPreview({ profileId }: PDFPreviewProps) {
  const { t } = useTranslation();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    validateProfile();
  }, [profileId]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const validateProfile = async () => {
    try {
      setValidating(true);
      const result = await templatesService.validateProfile(profileId);
      setValidation(result);
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setValidating(false);
    }
  };

  const handlePreview = async () => {
    console.log('=== PREVIEW PDF CLICKED ===');
    console.log('ProfileId:', profileId);
    console.log('Validation state:', validation);

    if (!validation?.isValid) {
      console.log('Preview cancelled: Profile is not valid');
      setError(t('pdf.errors.incompleteProfile'));
      return;
    }

    console.log('Starting PDF preview request...');
    console.log('Request details:', {
      endpoint: `/api/profiles/${profileId}/pdf/preview-pdf`,
      method: 'GET',
      profileId: profileId,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    try {
      setLoading(true);
      setError(null);

      const blob = await templatesService.previewPDF(profileId);
      console.log('PDF blob received:', {
        size: blob.size,
        type: blob.type,
      });

      // Verificar si el blob es realmente un PDF
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        // Los PDFs comienzan con %PDF
        const header = String.fromCharCode(...bytes.slice(0, 4));
        console.log('PDF header:', header);
        console.log('First 100 bytes:', String.fromCharCode(...bytes.slice(0, 100)));

        if (header !== '%PDF') {
          console.error('El blob no es un PDF válido. Header:', header);
          // Intentar leer como texto para ver el contenido
          const textReader = new FileReader();
          textReader.onload = (textE) => {
            console.log('Blob content as text:', textE.target?.result);
          };
          textReader.readAsText(blob);
          setError('El archivo recibido no es un PDF válido');
        }
      };
      reader.readAsArrayBuffer(blob.slice(0, 1000)); // Leer los primeros 1000 bytes

      const url = window.URL.createObjectURL(blob);
      console.log('PDF URL created:', url);
      setPdfUrl(url);
      setPreviewOpen(true);
    } catch (err) {
      console.error('=== PREVIEW PDF ERROR ===', err);
      const errorMessage = err instanceof Error ? err.message : t('pdf.errors.previewFailed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    console.log('=== EXPORT PDF CLICKED ===');
    console.log('ProfileId:', profileId);
    console.log('Validation state:', validation);

    if (!validation?.isValid) {
      console.log('Export cancelled: Profile is not valid');
      setError(t('pdf.errors.incompleteProfile'));
      return;
    }

    if (validation.warnings.length > 0) {
      console.log('Profile has warnings:', validation.warnings);
      const proceed = window.confirm(
        t('pdf.confirmExport', { completeness: validation.completeness })
      );
      if (!proceed) {
        console.log('Export cancelled by user');
        return;
      }
    }

    console.log('Starting PDF export request...');
    console.log('Request details:', {
      endpoint: `/api/profiles/${profileId}/pdf/export-pdf`,
      method: 'GET',
      profileId: profileId,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    try {
      setExporting(true);
      setError(null);

      const blob = await templatesService.exportPDF(profileId);
      console.log('PDF blob received:', {
        size: blob.size,
        type: blob.type,
      });

      // Verificar si el blob es realmente un PDF
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        // Los PDFs comienzan con %PDF
        const header = String.fromCharCode(...bytes.slice(0, 4));
        console.log('PDF header (export):', header);

        if (header !== '%PDF') {
          console.error('El blob de export no es un PDF válido. Header:', header);
          // Intentar leer como texto
          const textReader = new FileReader();
          textReader.onload = (textE) => {
            console.log('Export blob content as text:', textE.target?.result);
          };
          textReader.readAsText(blob);
        }
      };
      reader.readAsArrayBuffer(blob.slice(0, 1000));

      const url = window.URL.createObjectURL(blob);
      console.log('PDF URL created:', url);

      const filename = `CV-${Date.now()}.pdf`;
      console.log('Downloading file as:', filename);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('PDF export completed successfully');
    } catch (err) {
      console.error('=== EXPORT PDF ERROR ===', err);
      const errorMessage = err instanceof Error ? err.message : t('pdf.errors.exportFailed');
      setError(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl('');
    }
  };

  const getValidationIcon = () => {
    if (validating) return <CircularProgress size={20} />;
    if (!validation) return null;
    if (validation.isValid) return <ValidIcon color="success" />;
    return <ErrorIcon color="error" />;
  };

  const getValidationColor = (): 'success' | 'error' | 'info' => {
    if (!validation) return 'info';
    if (validation.isValid) return 'success';
    return 'error';
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {validation && (
        <Alert
          severity={getValidationColor()}
          icon={getValidationIcon()}
          sx={{ mb: 2 }}
        >
          <Box>
            <strong>
              {validation.isValid
                ? t('pdf.validProfile')
                : t('pdf.invalidProfile')}
            </strong>
            <Box sx={{ mt: 1 }}>
              {t('pdf.completeness')}: {validation.completeness}%
            </Box>

            {validation.warnings.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <strong>{t('pdf.warnings')}:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  {validation.warnings.map((warning, index) => (
                    <li key={index}>
                      {warning.message} ({t(`pdf.severity.${warning.severity}`)})
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        </Alert>
      )}

      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={20} /> : <PreviewIcon />}
          onClick={handlePreview}
          disabled={loading || !validation?.isValid}
        >
          {loading ? t('pdf.loading') : t('pdf.preview')}
        </Button>

        <Button
          variant="contained"
          startIcon={exporting ? <CircularProgress size={20} /> : <DownloadIcon />}
          onClick={handleExport}
          disabled={exporting || !validation?.isValid}
        >
          {exporting ? t('pdf.exporting') : t('pdf.export')}
        </Button>
      </Box>

      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {t('pdf.previewTitle')}
            <IconButton onClick={handleClosePreview} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, height: '80vh' }}>
          {pdfUrl && (
            <Box sx={{ width: '100%', height: '100%', position: 'relative', bgcolor: '#525659' }}>
              <object
                data={pdfUrl}
                type="application/pdf"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title="PDF Preview"
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: 2,
                    color: 'white',
                    px: 3,
                  }}
                >
                  <Typography variant="h6">
                    {t('pdf.previewNote') || 'No se puede mostrar el PDF en el navegador'}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleExport}
                    size="large"
                  >
                    {t('pdf.download')}
                  </Button>
                </Box>
              </object>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClosePreview}>{t('common.close')}</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            {t('pdf.download')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
