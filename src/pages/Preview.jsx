import { useCV } from '../context/CVContext';
import { generateHarvardCV } from '../utils/pdfGenerator';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Download,
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  GitHub,
  Language,
} from '@mui/icons-material';

export function Preview() {
  const { currentProfile } = useCV();

  if (!currentProfile) {
    return <Box sx={{ p: 4 }}>Cargando...</Box>;
  }

  const { personalInfo, education, experience, skills, languages, certifications } = currentProfile;

  const handleDownload = () => {
    generateHarvardCV(currentProfile);
  };

  const SectionTitle = ({ children }) => (
    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: 700,
        color: '#800000',
        borderBottom: '1px solid #800000',
        pb: 0.5,
        mb: 2,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="white">
            Vista Previa
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
            Revisa cómo se verá tu CV
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<Download />}
          onClick={handleDownload}
          sx={{ px: 4 }}
        >
          Descargar PDF
        </Button>
      </Box>

      {/* Vista previa estilo Harvard */}
      <Card sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ border: '2px solid #e5e7eb', borderRadius: 2, p: 4, bgcolor: 'white' }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', borderBottom: '2px solid #800000', pb: 2, mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#800000' }}>
                {personalInfo.fullName || 'Tu Nombre Completo'}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 2 }}>
                {personalInfo.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {personalInfo.email}
                    </Typography>
                  </Box>
                )}
                {personalInfo.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {personalInfo.phone}
                    </Typography>
                  </Box>
                )}
                {(personalInfo.city || personalInfo.country) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 1 }}>
                {personalInfo.linkedin && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LinkedIn sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {personalInfo.linkedin}
                    </Typography>
                  </Box>
                )}
                {personalInfo.github && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <GitHub sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {personalInfo.github}
                    </Typography>
                  </Box>
                )}
                {personalInfo.portfolio && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Language sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {personalInfo.portfolio}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Resumen */}
            {personalInfo.summary && (
              <Box sx={{ mb: 3 }}>
                <SectionTitle>Resumen Profesional</SectionTitle>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {personalInfo.summary}
                </Typography>
              </Box>
            )}

            {/* Educación */}
            {education?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <SectionTitle>Educación</SectionTitle>
                {education.map((edu) => (
                  <Box key={edu.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography fontWeight={700}>{edu.institution}</Typography>
                        <Typography variant="body2" fontStyle="italic" color="text.secondary">
                          {edu.degree} {edu.field && `en ${edu.field}`}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {edu.startDate} - {edu.endDate || 'Presente'}
                      </Typography>
                    </Box>
                    {edu.gpa && (
                      <Typography variant="body2" color="text.secondary">
                        GPA: {edu.gpa}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {/* Experiencia */}
            {experience?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <SectionTitle>Experiencia Profesional</SectionTitle>
                {experience.map((exp) => (
                  <Box key={exp.id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography fontWeight={700}>{exp.company}</Typography>
                        <Typography variant="body2" fontStyle="italic" color="text.secondary">
                          {exp.position}
                          {exp.location && ` | ${exp.location}`}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {exp.startDate} - {exp.endDate || 'Presente'}
                      </Typography>
                    </Box>
                    {exp.description && (
                      <List dense sx={{ mt: 1 }}>
                        {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                          <ListItem key={idx} sx={{ py: 0, pl: 2 }}>
                            <ListItemText
                              primary={`• ${line}`}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {/* Habilidades */}
            {skills?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <SectionTitle>Habilidades</SectionTitle>
                <Typography variant="body2" color="text.secondary">
                  {skills.join(' • ')}
                </Typography>
              </Box>
            )}

            {/* Idiomas */}
            {languages?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <SectionTitle>Idiomas</SectionTitle>
                {languages.map((lang) => (
                  <Typography key={lang.id} variant="body2" color="text.secondary">
                    <strong>{lang.name}:</strong> {lang.level}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Certificaciones */}
            {certifications?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <SectionTitle>Certificaciones</SectionTitle>
                {certifications.map((cert) => (
                  <Box key={cert.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography component="span" fontWeight={700}>
                        {cert.name}
                      </Typography>
                      {cert.issuer && (
                        <Typography component="span" fontStyle="italic" color="text.secondary">
                          {' '}- {cert.issuer}
                        </Typography>
                      )}
                    </Box>
                    {cert.date && (
                      <Typography variant="body2" color="text.secondary">
                        {cert.date}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<Download />}
          onClick={handleDownload}
          sx={{ px: 6, py: 1.5 }}
        >
          Descargar CV en PDF (Formato Harvard)
        </Button>
      </Box>
    </Box>
  );
}
