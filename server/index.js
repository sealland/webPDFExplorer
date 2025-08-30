require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 5028;

// Debug: แสดง environment variables
console.log('=== ENVIRONMENT VARIABLES ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PDF_BASE_PATH from env:', process.env.PDF_BASE_PATH);
console.log('CURRENT_YEAR from env:', process.env.CURRENT_YEAR);
console.log('PORT from env:', process.env.PORT);
console.log('Current working directory:', process.cwd());
console.log('Env file path:', path.join(__dirname, '../.env'));
console.log('Env file exists:', fs.existsSync(path.join(__dirname, '../.env')));
console.log('=============================');

// เพิ่ม configuration สำหรับ PDF directory path จาก .env
const PDF_BASE_PATH = process.env.PDF_BASE_PATH || 'Z:';

// เพิ่ม scope สำหรับปีปัจจุบัน จาก .env
const CURRENT_YEAR = process.env.CURRENT_YEAR || '2568';

// แก้ไขการสร้าง path สำหรับ UNC
let PDF_CURRENT_YEAR_PATH;
if (PDF_BASE_PATH.startsWith('\\\\') || PDF_BASE_PATH.startsWith('//')) {
  // สำหรับ UNC path
  PDF_CURRENT_YEAR_PATH = path.join(PDF_BASE_PATH, CURRENT_YEAR);
} else {
  // สำหรับ mapped drive
  PDF_CURRENT_YEAR_PATH = path.join(PDF_BASE_PATH, CURRENT_YEAR);
}

console.log('=== CONFIGURATION ===');
console.log('PDF_BASE_PATH:', PDF_BASE_PATH);
console.log('CURRENT_YEAR:', CURRENT_YEAR);
console.log('CURRENT_YEAR_PATH:', PDF_CURRENT_YEAR_PATH);
console.log('====================');

// Middleware
app.use(cors({
  origin: ['http://localhost:3028', 'http://localhost:5028' , 'https://whs.zubbsteel.com'],
  credentials: true
}));
app.use(express.json());

// Serve PDF files
router.use('/pdfs', express.static(PDF_BASE_PATH));

// Serve static files from React build
const buildPath = path.join(__dirname, '../client/build');
console.log('Build path:', buildPath);
console.log('Build path exists:', fs.existsSync(buildPath));
console.log('Index.html exists:', fs.existsSync(path.join(buildPath, 'index.html')));

router.use(express.static(buildPath));

// API Routes

// Get folder structure - เฉพาะปีปัจจุบัน
router.get('/api/folders', (req, res) => {
  try {
    const pdfsPath = PDF_CURRENT_YEAR_PATH;
    
    console.log('Checking path:', pdfsPath);
    
    // Check if pdfs directory exists
    if (!fs.existsSync(pdfsPath)) {
      console.log('❌ Directory does not exist:', pdfsPath);
      return res.status(404).json({ 
        error: 'Current year directory not accessible',
        message: `Please check if ${CURRENT_YEAR} directory exists`,
        path: pdfsPath,
        config: {
          pdfBasePath: PDF_BASE_PATH,
          currentYear: CURRENT_YEAR
        }
      });
    }

    const getFolderStructure = (dirPath) => {
      try {
        const items = fs.readdirSync(dirPath);
        const folders = [];
        
        items.forEach(item => {
          try {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            const relativePath = path.relative(PDF_BASE_PATH, itemPath);
            
            if (stats.isDirectory()) {
              const children = getFolderStructure(itemPath);
              folders.push({
                name: item,
                path: relativePath,
                type: 'folder',
                children: children
              });
            } else if (stats.isFile() && path.extname(item).toLowerCase() === '.pdf') {
              folders.push({
                name: item,
                path: relativePath,
                type: 'file',
                size: stats.size,
                modified: stats.mtime
              });
            }
          } catch (itemError) {
            console.error(`Error processing item ${item}:`, itemError);
          }
        });
        
        return folders.sort((a, b) => {
          if (a.type === 'folder' && b.type === 'file') return -1;
          if (a.type === 'file' && b.type === 'folder') return 1;
          return a.name.localeCompare(b.name);
        });
      } catch (dirError) {
        console.error(`Error reading directory ${dirPath}:`, dirError);
        return [];
      }
    };

    const folderStructure = getFolderStructure(pdfsPath);
    console.log('✅ Successfully read folder structure for year:', CURRENT_YEAR);
    res.json({ 
      folders: folderStructure,
      currentYear: CURRENT_YEAR,
      path: pdfsPath,
      config: {
        pdfBasePath: PDF_BASE_PATH,
        currentYear: CURRENT_YEAR
      }
    });
  } catch (error) {
    console.error('❌ Error reading folder structure:', error);
    res.status(500).json({ 
      error: 'Failed to read folder structure',
      message: error.message 
    });
  }
});

// Get all years
router.get('/api/years', (req, res) => {
  try {
    const years = fs.readdirSync(PDF_BASE_PATH)
      .filter(item => {
        const itemPath = path.join(PDF_BASE_PATH, item);
        return fs.statSync(itemPath).isDirectory() && /^\d{4}$/.test(item);
      })
      .sort((a, b) => b - a); // Sort descending (newest first)
    
    res.json({ years });
  } catch (error) {
    console.error('Error reading years:', error);
    res.status(500).json({ error: 'Failed to read years' });
  }
});

// Get folder structure for specific year
router.get('/api/folders/:year', (req, res) => {
  try {
    const year = req.params.year;
    const yearPath = path.join(PDF_BASE_PATH, year);
    
    if (!fs.existsSync(yearPath)) {
      return res.status(404).json({ error: 'Year not found' });
    }
    
    const getFolderStructure = (dirPath) => {
      try {
        const items = fs.readdirSync(dirPath);
        const folders = [];
        
        items.forEach(item => {
          try {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);
            const relativePath = path.relative(PDF_BASE_PATH, itemPath);
            
            if (stats.isDirectory()) {
              const children = getFolderStructure(itemPath);
              folders.push({
                name: item,
                path: relativePath,
                type: 'folder',
                children: children
              });
            } else if (stats.isFile() && path.extname(item).toLowerCase() === '.pdf') {
              folders.push({
                name: item,
                path: relativePath,
                type: 'file',
                size: stats.size,
                modified: stats.mtime
              });
            }
          } catch (itemError) {
            console.error(`Error processing item ${item}:`, itemError);
          }
        });
        
        return folders.sort((a, b) => {
          if (a.type === 'folder' && b.type === 'file') return -1;
          if (a.type === 'file' && b.type === 'folder') return 1;
          return a.name.localeCompare(b.name);
        });
      } catch (dirError) {
        console.error(`Error reading directory ${dirPath}:`, dirError);
        return [];
      }
    };

    const folderStructure = getFolderStructure(yearPath);
    res.json({ 
      folders: folderStructure,
      year: year,
      path: yearPath
    });
  } catch (error) {
    console.error('Error reading folder structure for year:', error);
    res.status(500).json({ error: 'Failed to read folder structure' });
  }
});

// Get file info
router.get('/api/file/:filePath(*)', (req, res) => {
  try {
    const filePath = decodeURIComponent(req.params.filePath);
    const fullPath = path.join(PDF_BASE_PATH, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const stats = fs.statSync(fullPath);
    res.json({
      name: path.basename(filePath),
      path: filePath,
      size: stats.size,
      modified: stats.mtime,
      url: `/pdfs/${filePath}`
    });
  } catch (error) {
    console.error('Error getting file info:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

// Serve index.html for all routes (SPA) - ต้องอยู่หลัง API routes
router.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('React app not built. Please run "npm run build" first.');
  }
});

app.use('/pdfviewer', router);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(` PDF files path: ${PDF_BASE_PATH}`);
  console.log(` Current year path: ${PDF_CURRENT_YEAR_PATH}`);
  console.log(`🌐 Backend API at: http://localhost:${PORT}`);
  console.log(`🌐 Frontend at: http://localhost:${PORT}`);
  
  // Check if network drive is accessible
  if (fs.existsSync(PDF_BASE_PATH)) {
    console.log('✅ Network drive accessible');
    try {
      const items = fs.readdirSync(PDF_CURRENT_YEAR_PATH);
      console.log(`💡 Found ${items.length} items in ${CURRENT_YEAR}`);
      console.log(' First few items:', items.slice(0, 5));
    } catch (error) {
      console.log('❌ Network drive not accessible');
      console.log('💡 Please check:');
      console.log('   1. Network drive path:', PDF_BASE_PATH);
      console.log('   2. Network connectivity to:', PDF_BASE_PATH);
      console.log('   3. Check permissions and credentials');
    }
  } else {
    console.log('❌ Network drive not accessible');
    console.log('💡 Please check:');
    console.log('   1. Network drive path:', PDF_BASE_PATH);
    console.log('   2. Network connectivity to:', PDF_BASE_PATH);
    console.log('   3. Check permissions and credentials');
  }
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log(' Please try:');
    console.log(`   1. Kill process using port ${PORT}: netstat -ano | findstr :${PORT}`);
    console.log(`   2. Or change PORT in .env file`);
  } else {
    console.error('❌ Server error:', err);
  }
});