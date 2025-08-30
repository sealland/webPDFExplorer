import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Toolbar,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Download as DownloadIcon,
  OpenInNew as OpenInNewIcon,
  Image as ImageIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ selectedFile }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [zoomDialogOpen, setZoomDialogOpen] = useState(false);
  const [customZoom, setCustomZoom] = useState(100);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (selectedFile) {
      loadPDF(selectedFile);
    } else {
      setPdfDoc(null);
      setCurrentPage(1);
      setNumPages(0);
      setError(null);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (pdfDoc && currentPage <= numPages) {
      renderPage();
    }
  }, [pdfDoc, currentPage, scale]);

  const loadPDF = async (file) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${process.env.PUBLIC_URL}/pdfs/${file.path}`;
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      setCurrentPage(1);
      setScale(1.0);
      setCustomZoom(100);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF file. Please check if the file exists and is not corrupted.');
    } finally {
      setLoading(false);
    }
  };

  const renderPage = async () => {
    try {
      const page = await pdfDoc.getPage(currentPage);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
      setError('Failed to render PDF page.');
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleCustomZoom = () => {
    const newScale = customZoom / 100;
    if (newScale >= 0.1 && newScale <= 5.0) {
      setScale(newScale);
      setZoomDialogOpen(false);
      showSnackbar(`Zoom set to ${customZoom}%`);
    } else {
      showSnackbar('Zoom must be between 10% and 500%');
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, numPages));
  };

  const handleDownload = () => {
    if (selectedFile) {
      const link = document.createElement('a');
      link.href = `${process.env.PUBLIC_URL}/pdfs/${selectedFile.path}`;
      link.download = selectedFile.name;
      link.click();
      showSnackbar('Download started');
    }
  };

  const handleDownloadImage = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Create a temporary link
      const link = document.createElement('a');
      link.download = `${selectedFile.name.replace('.pdf', '')}_page_${currentPage}.png`;
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        showSnackbar('Image downloaded successfully');
      }, 'image/png');
    } catch (error) {
      console.error('Error downloading image:', error);
      showSnackbar('Failed to download image');
    }
  };

  const handleOpenInNewTab = () => {
    if (selectedFile) {
      window.open(`${process.env.PUBLIC_URL}/pdfs/${selectedFile.path}`, '_blank');
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleCustomZoom();
    }
  };

  if (!selectedFile) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: 400,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Select a PDF file to view
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <Paper sx={{ mb: 2 }}>
        <Toolbar variant="dense">
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {selectedFile.name} - Page {currentPage} of {numPages}
          </Typography>
          
          <IconButton
            onClick={handlePreviousPage}
            disabled={currentPage <= 1}
            size="small"
            title="Previous page"
          >
            ←
          </IconButton>
          
          <IconButton
            onClick={handleNextPage}
            disabled={currentPage >= numPages}
            size="small"
            title="Next page"
          >
            →
          </IconButton>
          
          <IconButton onClick={handleZoomOut} size="small" title="Zoom out">
            <ZoomOutIcon />
          </IconButton>
          
          <Typography 
            variant="body2" 
            sx={{ 
              mx: 1, 
              minWidth: '60px', 
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 1 }
            }}
            onClick={() => setZoomDialogOpen(true)}
            title="Click to set custom zoom"
          >
            {Math.round(scale * 100)}%
          </Typography>
          
          <IconButton onClick={handleZoomIn} size="small" title="Zoom in">
            <ZoomInIcon />
          </IconButton>
          
          <IconButton onClick={handleDownload} size="small" title="Download PDF">
            <DownloadIcon />
          </IconButton>
          
          <IconButton onClick={handleDownloadImage} size="small" title="Download as image">
            <ImageIcon />
          </IconButton>
          
          <IconButton onClick={handleOpenInNewTab} size="small" title="Open in new tab">
            <OpenInNewIcon />
          </IconButton>
        </Toolbar>
      </Paper>

      {/* PDF Canvas Container with Scroll */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
          position: 'relative',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '100%',
            p: 2,
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              border: '1px solid #ddd',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'grab',
              userSelect: 'none',
            }}
            onMouseDown={(e) => {
              e.target.style.cursor = 'grabbing';
            }}
            onMouseUp={(e) => {
              e.target.style.cursor = 'grab';
            }}
          />
        </Box>
      </Box>

      {/* Custom Zoom Dialog */}
      <Dialog open={zoomDialogOpen} onClose={() => setZoomDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Set Custom Zoom</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Zoom Percentage"
            type="number"
            fullWidth
            variant="outlined"
            value={customZoom}
            onChange={(e) => setCustomZoom(Number(e.target.value))}
            onKeyPress={handleKeyPress}
            inputProps={{
              min: 10,
              max: 500,
              step: 1
            }}
            helperText="Enter a value between 10% and 500%"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setZoomDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCustomZoom} variant="contained">Set Zoom</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default PDFViewer;