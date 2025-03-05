/**
 * Main Layout Component
 * Current date: 2025-03-05 14:15:16
 * Current user: alschell
 */

import { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import WarningIcon from '@mui/icons-material/Warning';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const drawerWidth = 240;

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Compliance', icon: <SecurityIcon />, path: '/compliance' },
    { text: 'Policies', icon: <DescriptionIcon />, path: '/policies' },
    { text: 'Vendors', icon: <BusinessIcon />, path: '/vendors' },
    { text: 'Incidents', icon: <WarningIcon />, path: '/incidents' }
  ];
  
  // Only show settings to admin users
  if (user?.role === 'admin') {
    menuItems.push({ text: 'Settings', icon: <SettingsIcon />, path: '/settings' });
  }
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Tooltip title="Account settings">
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar
                sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                alt={user?.firstName || 'User'}
              >
                {user?.firstName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={handleDrawerClose}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <Box sx={{ overflow: 'auto', height: '100%' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
