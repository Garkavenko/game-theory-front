import React from 'react';
import {Box, Typography} from "@mui/material";

interface BlockProps {
  children: React.ReactNode,
  title?: React.ReactNode,
  titleColor?: string,
}

function Block({ children, title, titleColor }: BlockProps) {
  return (
    <Box sx={{ backgroundColor: 'white', padding: 2, boxShadow: 4, margin: 2 }}>
      {!!title && (
        <Box sx={{backgroundColor: titleColor || '#8e8e8e', margin: -2, marginBottom: 2, padding: 2, paddingTop: 1, paddingBottom: 1}}>
          <Typography style={{color: 'white', fontSize: 16}}>{title}</Typography>
        </Box>
      )}
      {children}
    </Box>
  )
}

export default Block;
