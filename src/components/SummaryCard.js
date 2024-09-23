import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const SummaryCard = ({ title, value, icon }) => (
  <Card
    sx={{
      backgroundColor: '#E8F5E9',
      display: 'flex',
      alignItems: 'center',
      padding: 2,
      borderRadius: 2,
      boxShadow: 1,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}
  >
    <Box sx={{ mr: 2 }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle1" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h6">
        {value}
      </Typography>
    </Box>
  </Card>
);

export default SummaryCard;
