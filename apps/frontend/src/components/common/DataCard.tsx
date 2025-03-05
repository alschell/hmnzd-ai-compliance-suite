/**
 * Data Card Component
 * Current date: 2025-03-05 14:15:16
 * Current user: alschell
 */

import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface DataCardProps {
  title: string;
  subtitle?: string;
  content: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
  actionMenu?: ReactNode;
  fullHeight?: boolean;
  variant?: 'default' | 'outlined';
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

const DataCard = ({
  title,
  subtitle,
  content,
  icon,
  footer,
  actionMenu,
  fullHeight = false,
  variant = 'default',
  color = 'default'
}: DataCardProps) => {
  // Determine background color based on color prop
  const getBgColor = () => {
    if (variant === 'outlined' || color === 'default') return 'background.paper';
    
    switch(color) {
      case 'primary': return 'primary.light';
      case 'secondary': return 'secondary.light';
      case 'error': return 'error.light';
      case 'warning': return 'warning.light';
      case 'info': return 'info.light';
      case 'success': return 'success.success';
      default: return 'background.paper';
    }
  };
  
  // Determine text color based on color prop
  const getTextColor = () => {
    if (variant === 'outlined' || color === 'default') return 'text.primary';
    
    switch(color) {
      case 'primary': return 'primary.dark';
      case 'secondary': return 'secondary.dark';
      case 'error': return 'error.dark';
      case 'warning': return 'warning.dark';
      case 'info': return 'info.dark';
      case 'success': return 'success.dark';
      default: return 'text.primary';
    }
  };

  return (
    <Card
      elevation={variant === 'outlined' ? 0 : 2}
      sx={{
        height: fullHeight ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        border: variant === 'outlined' ? 1 : 0,
        borderColor: variant === 'outlined' ? 'divider' : 'transparent',
        backgroundColor: getBgColor(),
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: variant === 'outlined' ? 1 : 3
        }
      }}
    >
      <CardContent sx={{ p: 2, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {icon && (
              <Box sx={{ mr: 1, color: getTextColor() }}>
                {icon}
              </Box>
            )}
            <Box>
              <Typography 
                variant="h6" 
                component="h2" 
                color={getTextColor()}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          {actionMenu && (
            <Tooltip title="Options">
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        <Box>
          {content}
        </Box>
      </CardContent>
      
      {footer && (
        <>
          <Divider />
          <Box sx={{ p: 1.5, backgroundColor: 'background.default' }}>
            {footer}
          </Box>
        </>
      )}
    </Card>
  );
};

export default DataCard;
