import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import { CVProvider } from './context/CVContext';
import { Sidebar } from './components/Sidebar';
import { PersonalInfo } from './pages/PersonalInfo';
import { Experience } from './pages/Experience';
import { Education } from './pages/Education';
import { Skills } from './pages/Skills';
import { Languages } from './pages/Languages';
import { Certifications } from './pages/Certifications';
import { Preview } from './pages/Preview';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CVProvider>
        <BrowserRouter>
          <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 4,
                overflow: 'auto',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '100vh',
              }}
            >
              <Routes>
                <Route path="/" element={<PersonalInfo />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/education" element={<Education />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/languages" element={<Languages />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/preview" element={<Preview />} />
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </CVProvider>
    </ThemeProvider>
  );
}

export default App;
