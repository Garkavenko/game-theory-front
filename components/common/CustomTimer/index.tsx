import { Box } from '@mui/material';
import React from 'react';
import Timer from "../Timer";

function CustomTimer({ nextTickAt }: { nextTickAt: number }) {
  function getTimeAnimation() {
    if (nextTickAt - Date.now() < 30000) {
      return {
        color: 'red',
        animation: 'blink 1s linear infinite',
        '@keyframes blink': {
          '0%': {
            opacity: .3,
          },
          '50%': {
            opacity: 1,
          },
          '100%': {
            opacity: .3,
          }
        }
      }
    }
    return {};
  }
  return (
    <Box sx={{
      color: 'gray',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', ...getTimeAnimation()
    }}>
      <Box sx={{fontSize: 11}}>
        До следующего шага:
      </Box>
      <Box sx={{fontSize: 40, fontWeight: 'bold'}}>
        <Timer finishAt={nextTickAt || 0}/>
      </Box>
    </Box>
  )
}

export default CustomTimer;
