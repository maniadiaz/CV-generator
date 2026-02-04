import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { SvgIconComponent } from '@mui/icons-material';

interface SectionCardProps {
  title: string;
  description: string;
  icon: SvgIconComponent;
  path: string;
  count?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

const SectionCard = ({
  title,
  description,
  icon: Icon,
  path,
  count,
  color = 'primary',
}: SectionCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: '100%', p: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: `${color}.main`,
                color: 'white',
              }}
            >
              <Icon fontSize="large" />
            </Box>
            {count !== undefined && (
              <Typography variant="h4" color="text.secondary" fontWeight="bold">
                {count}
              </Typography>
            )}
          </Box>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SectionCard;
