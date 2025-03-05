/**
 * Status Chip Component
 * Current date: 2025-03-05 14:15:16
 * Current user: alschell
 */

import { Chip, ChipProps, Tooltip } from '@mui/material';

// Status types that can be used with this component
type StatusType =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'draft'
  | 'published'
  | 'approved'
  | 'rejected'
  | 'in-review'
  | 'open'
  | 'closed'
  | 'resolved'
  | 'investigating'
  | 'mitigated'
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'implemented'
  | 'not-implemented'
  | 'partial'
  | 'not-applicable';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: string;
  withTooltip?: boolean;
  size?: 'small' | 'medium';
}

const StatusChip = ({ 
  status, 
  withTooltip = false, 
  size = 'small',
  ...rest 
}: StatusChipProps) => {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-') as StatusType;
  
  // Configuration for different status types
  const statusConfig: Record<
    StatusType,
    { color: ChipProps['color']; icon?: React.ReactElement; tooltip?: string }
  > = {
    // General statuses
    'active': { 
      color: 'success',
      tooltip: 'This item is currently active' 
    },
    'inactive': { 
      color: 'default',
      tooltip: 'This item is currently inactive' 
    },
    'pending': { 
      color: 'warning',
      tooltip: 'This item is pending action or approval' 
    },
    
    // Document statuses
    'draft': { 
      color: 'default',
      tooltip: 'This document is in draft stage' 
    },
    'published': { 
      color: 'success',
      tooltip: 'This document has been published' 
    },
    'approved': { 
      color: 'success',
      tooltip: 'This item has been approved' 
    },
    'rejected': { 
      color: 'error',
      tooltip: 'This item has been rejected' 
    },
    'in-review': { 
      color: 'info',
      tooltip: 'This item is currently under review' 
    },
    
    // Incident statuses
    'open': { 
      color: 'error',
      tooltip: 'This incident is open and needs attention' 
    },
    'closed': { 
      color: 'success',
      tooltip: 'This incident has been closed' 
    },
    'resolved': { 
      color: 'success',
      tooltip: 'This incident has been resolved' 
    },
    'investigating': { 
      color: 'warning',
      tooltip: 'This incident is being investigated' 
    },
    'mitigated': { 
      color: 'info',
      tooltip: 'Mitigating actions have been applied' 
    },
    
    // Severity levels
    'critical': { 
      color: 'error',
      tooltip: 'Critical severity - requires immediate attention' 
    },
    'high': { 
      color: 'error',
      tooltip: 'High severity - requires prompt attention' 
    },
    'medium': { 
      color: 'warning',
      tooltip: 'Medium severity - should be addressed soon' 
    },
    'low': { 
      color: 'info',
      tooltip: 'Low severity - can be addressed in normal course of operations' 
    },
    
    // Implementation statuses
    'implemented': { 
      color: 'success',
      tooltip: 'This control has been implemented' 
    },
    'not-implemented': { 
      color: 'error',
      tooltip: 'This control has not been implemented' 
    },
    'partial': { 
      color: 'warning',
      tooltip: 'This control has been partially implemented' 
    },
    'not-applicable': { 
      color: 'default',
      tooltip: 'This control is not applicable' 
    },
  };
  
  const config = statusConfig[normalizedStatus] || {
    color: 'default',
    tooltip: `Status: ${status}`
  };
  
  const displayText = status.replace(/-/g, ' ');
  
  const chipContent = (
    <Chip
      label={displayText}
      size={size}
      color={config.color}
      {...rest}
    />
  );
  
  if (withTooltip) {
    return (
      <Tooltip title={config.tooltip || displayText}>
        {chipContent}
      </Tooltip>
    );
  }
  
  return chipContent;
};

export default StatusChip;
