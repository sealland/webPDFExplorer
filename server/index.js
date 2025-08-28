require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5028;

// เพิ่ม configuration สำหรับ PDF directory path
// ตั้งค่าให้ชี้ไปที่ Z: drive โดยตรง
const PDF_BASE_PATH = 'Z:';

// เพิ่ม scope สำหรับปีปัจจุบัน (2568)
const CURRENT_YEAR = '2568';
const PDF_CURRENT_YEAR_PATH = path.join(PDF_BASE_PATH, CURRENT_YEAR);

console.log('PDF_BASE_PATH:', PDF_BASE_PATH);
console.log('CURRENT_YEAR_PATH:', PDF_CURRENT_YEAR_PATH);

// Middleware
app.use(cors({
  origin: ['http://localhost:3028', 'http://localhost:5028'],
  credentials: true
}));
app.use(express.json());

// Serve PDF files
app.use('/pdfs', express.static(PDF_BASE_PATH));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes

// Get folder structure - เฉพาะปีปัจจุบัน
app.get('/api/folders', (req, res) => {
  try {
    const pdfsPath = PDF_CURRENT_YEAR_PATH; // เปลี่ยนเป็นปีปัจจุบัน
    
    console.log('Checking path:', pdfsPath);
    
    // Check if pdfs directory exists
    if (!fs.existsSync(pdfsPath)) {
      console.log('❌ Directory does not exist:', pdfsPath);
      return res.status(404).json({ 
        error: 'Current year directory not accessible',
        message: `Please check if ${CURRENT_YEAR} directory exists`,
        path: pdfsPath
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
            const relativePath = path.relative(PDF_BASE_PATH, itemPath); // เปลี่ยนเป็น relative to base path
            
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
      path: pdfsPath
    });
  } catch (error) {
    console.error('❌ Error reading folder structure:', error);
    res.status(500).json({ 
      error: 'Failed to read folder structure',
      message: error.message 
    });
  }
});

// Get all years (optional API)
app.get('/api/years', (req, res) => {
  try {
    const pdfsPath = PDF_BASE_PATH;
    
    if (!fs.existsSync(pdfsPath)) {
      return res.status(404).json({ 
        error: 'Network drive not accessible',
        message: 'Please check if Z: drive is properly mapped'
      });
    }

    const items = fs.readdirSync(pdfsPath);
    const years = items.filter(item => {
      const itemPath = path.join(pdfsPath, item);
      return fs.statSync(itemPath).isDirectory();
    }).sort();

    res.json({ 
      years: years,
      currentYear: CURRENT_YEAR
    });
  } catch (error) {
    console.error('❌ Error reading years:', error);
    res.status(500).json({ 
      error: 'Failed to read years',
      message: error.message 
    });
  }
});

// Get folder structure for specific year
app.get('/api/folders/:year', (req, res) => {
  try {
    const year = req.params.year;
    const pdfsPath = path.join(PDF_BASE_PATH, year);
    
    console.log('Checking path for year:', year, 'Path:', pdfsPath);
    
    if (!fs.existsSync(pdfsPath)) {
      return res.status(404).json({ 
        error: 'Year directory not found',
        message: `Directory for year ${year} does not exist`,
        path: pdfsPath
      });
    }

    // ใช้ getFolderStructure function เดิม
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
    console.log('✅ Successfully read folder structure for year:', year);
    res.json({ 
      folders: folderStructure,
      year: year,
      path: pdfsPath
    });
  } catch (error) {
    console.error('❌ Error reading folder structure:', error);
    res.status(500).json({ 
      error: 'Failed to read folder structure',
      message: error.message 
    });
  }
});

// Get file info
app.get('/api/file/:filePath(*)', (req, res) => {
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

// Serve React app for all other routes
app.get('*', (req, res) => {
  const buildPath = path.join(__dirname, '../client/build/index.html');
  if (fs.existsSync(buildPath)) {
    res.sendFile(buildPath);
  } else {
    res.status(404).send('React app not built. Please run "npm run build" first.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 PDF files path: ${PDF_BASE_PATH}`);
  console.log(`📁 Current year path: ${PDF_CURRENT_YEAR_PATH}`);
  console.log(`🌐 Backend API at: http://localhost:${PORT}`);
  console.log(`🌐 Frontend at: http://localhost:3028`);
  
  // ทดสอบการเข้าถึง Z: drive และปีปัจจุบัน
  try {
    if (fs.existsSync(PDF_BASE_PATH)) {
      console.log('✅ Z: drive accessible');
      
      if (fs.existsSync(PDF_CURRENT_YEAR_PATH)) {
        const items = fs.readdirSync(PDF_CURRENT_YEAR_PATH);
        console.log(`📁 Found ${items.length} items in ${CURRENT_YEAR}`);
        if (items.length > 0) {
          console.log('📋 First few items:', items.slice(0, 5));
        }
      } else {
        console.log(`❌ ${CURRENT_YEAR} directory not found`);
      }
    } else {
      console.log('❌ Z: drive not accessible');
      console.log('💡 Please check:');
      console.log('   1. Network drive is mapped to Z:');
      console.log('   2. Run: net use Z: \\\\199.0.0.25\\Drawing-Picture\\MWH\\workscale\\2568');
      console.log('   3. Check permissions');
    }
  } catch (error) {
    console.log('❌ Error accessing Z: drive:', error.message);
  }
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log('💡 Try these solutions:');
    console.log(`   1. Kill the process using port ${PORT}:`);
    console.log(`      netstat -ano | findstr :${PORT}`);
    console.log(`      taskkill /PID [PID] /F`);
    console.log(`   2. Or change the port in server/index.js`);
  } else {
    console.error('❌ Server error:', error.message);
  }
});
