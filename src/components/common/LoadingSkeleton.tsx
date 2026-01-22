import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';

interface LoadingSkeletonProps {
  type?: 'table' | 'card' | 'chart' | 'kpi';
  rows?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', rows = 5 }) => {
  if (type === 'kpi') {
    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {[...Array(6)].map((_, index) => (
          <Card key={index} sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 250 }}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="60%" height={48} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (type === 'chart') {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  if (type === 'table') {
    return (
      <Box>
        <Skeleton variant="text" width="100%" height={56} sx={{ mb: 1 }} />
        {[...Array(rows)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" width="100%" height={52} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="40%" />
      </CardContent>
    </Card>
  );
};

export default LoadingSkeleton;
