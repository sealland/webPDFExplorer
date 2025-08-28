import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  InsertDriveFile as FileIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const FolderTree = ({ folders, onFileSelect, onPathChange }) => {
  const [expanded, setExpanded] = useState({});

  const handleToggle = (path) => {
    setExpanded(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      handleToggle(item.path);
      onPathChange(item.path);
    } else if (item.type === 'file') {
      onFileSelect(item);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderTreeItems = (items, level = 0) => {
    return items.map((item) => (
      <Box key={item.path}>
        <ListItem
          button
          onClick={() => handleItemClick(item)}
          sx={{
            pl: level * 2 + 2,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {item.type === 'folder' ? (
              expanded[item.path] ? <FolderOpenIcon color="primary" /> : <FolderIcon />
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
              item.type === 'file' && (
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(item.size)}
                </Typography>
              )
            }
          />
          {item.type === 'folder' && item.children && item.children.length > 0 && (
            <IconButton size="small">
              {expanded[item.path] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </ListItem>
        {item.type === 'folder' && item.children && (
          <Collapse in={expanded[item.path]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderTreeItems(item.children, level + 1)}
            </List>
          </Collapse>
        )}
      </Box>
    ));
  };

  if (!folders || folders.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No folders found. Please create a 'pdfs' directory with your PDF files.
        </Typography>
      </Box>
    );
  }

  return (
    <List dense>
      {renderTreeItems(folders)}
    </List>
  );
};

export default FolderTree;
