import React from 'react';
import {Box, Typography, useTheme} from "@mui/material";
import Timer from "../Timer";
import Block from "../Block";

interface ParticipantGameInfoProps {
  currentStep: number;
}

function ParticipantGameInfo({ currentStep }: ParticipantGameInfoProps) {
  const theme = useTheme();
  return (
    <>
      <Box sx={{ display: 'flex', marginBottom: 1 }}>
        <Box sx={{ marginRight: 2, color: theme.palette.common.black, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ fontSize: 11 }}>
            Текущий шаг:
          </Box>
          <Box sx={{ fontSize: 40, fontWeight: 'bold' }}>
            {currentStep}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ParticipantGameInfo;
