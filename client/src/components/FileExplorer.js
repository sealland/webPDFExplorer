import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Folder as FolderIcon
} from '@mui/icons-material';

const FileExplorer = ({ folders, currentPath, onFileSelect }) => {
  const findCurrentFolder = (items, targetPath) => {
    for (const item of items) {
      if (item.path === targetPath) {
        return item;
      }
      if (item.type === 'folder' && item.children) {
        const found = findCurrentFolder(item.children, targetPath);
        if (found) return found;
      }
    }
    return null;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getCurrentItems = () => {
    if (!currentPath) {
      return folders;
    }
    
    const currentFolder = findCurrentFolder(folders, currentPath);
    return currentFolder ? currentFolder.children || [] : [];
  };

  const currentItems = getCurrentItems();

  const handleItemClick = (item) => {
    if (item.type === 'file') {
      onFileSelect(item);
    }
  };

  if (!currentPath) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Select a folder from the tree to view its contents
        </Typography>
      </Box>
    );
  }

  if (!currentItems || currentItems.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          This folder is empty
        </Typography>
      </Box>
    );
  }

  return (
    <List dense>
      {currentItems.map((item, index) => (
        <Box key={item.path}>
          <ListItem
            button
            onClick={() => handleItemClick(item)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {item.type === 'folder' ? (
                <FolderIcon color="primary" />
              ) : (
                <FileIcon color="action" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: item.type === 'folder' ? 500 : 400,
                    color: item.type === 'folder' ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {item.name}
                </Typography>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  {item.type === 'file' && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={formatFileSize(item.size)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={formatDate(item.modified)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  )}
                </Box>
              }
            />
          </ListItem>
          {index < currentItems.length - 1 && <Divider />}
        </Box>
      ))}
    </List>
  );
};

export default FileExplorer;
