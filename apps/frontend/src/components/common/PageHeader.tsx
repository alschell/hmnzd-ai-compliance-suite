/**
 * Page Header Component
 * Current date: 2025-03-05 14:15:16
 * Current user: alschell
 */

import { ReactNode } from 'react';
import { Typography, Box, Breadcrumbs, Link, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    link?: string;
  }>;
  action?: ReactNode;
}

const PageHeader = ({ title, subtitle, breadcrumbs, action }: PageHeaderProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: 'background.default',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: breadcrumbs ? 1 : 0,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
      
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mt: 1 }}
        >
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            if (isLast || !breadcrumb.link) {
              return (
                <Typography
                  key={breadcrumb.label}
                  color="textPrimary"
                  sx={isLast ? { fontWeight: 500 } : {}}
                >
                  {breadcrumb.label}
                </Typography>
              );
            }
            
            return (
              <Link
                key={breadcrumb.label}
                component={RouterLink}
                to={breadcrumb.link}
                color="inherit"
                underline="hover"
              >
                {breadcrumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
    </Paper>
  );
};

export default PageHeader;
