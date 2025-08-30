import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import FolderTree from './components/FolderTree';
import PDFViewer from './components/PDFViewer';
import FileExplorer from './components/FileExplorer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [folders, setFolders] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.PUBLIC_URL}/api/folders`);
      if (!response.ok) {
        throw new Error('Failed to fetch folder structure');
      }
      const data = await response.json();
      setFolders(data.folders || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching folders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handlePathChange = (path) => {
    setCurrentPath(path);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              PDF Explorer
            </Typography>
            {currentPath && (
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {currentPath}
              </Typography>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3} sx={{ height: 'calc(100vh - 140px)' }}>
            {/* Folder Tree */}
            <Grid item xs={12} md={3}>
              <Paper className="folder-tree" sx={{ height: '100%', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Folder Structure
                </Typography>
                <FolderTree
                  folders={folders}
                  onFileSelect={handleFileSelect}
                  onPathChange={handlePathChange}
                />
              </Paper>
            </Grid>

            {/* File Explorer */}
            <Grid item xs={12} md={3}>
              <Paper className="file-explorer" sx={{ height: '100%', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Files
                </Typography>
                <FileExplorer
                  folders={folders}
                  currentPath={currentPath}
                  onFileSelect={handleFileSelect}
                />
              </Paper>
            </Grid>

            {/* PDF Viewer */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ height: '100%', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  PDF Viewer
                </Typography>
                <PDFViewer selectedFile={selectedFile} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
