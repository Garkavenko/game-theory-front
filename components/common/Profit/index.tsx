import { Box } from '@mui/material';
import { round } from 'lodash';
import React from 'react';

function Profit({ curr, prev }: { curr: number, prev?: number }) {
  function getStylesForResult() {
    if (prev !== undefined && prev !== null) {
      if (curr > prev) {
        return { color: 'green', fill: 'green', transform: 'rotate(0deg)' };
      }
      if (curr < prev) {
        return { color: 'red', fill: 'red', transform: 'rotate(180deg)' };
      }
    }
    return { color: 'gray', fill: 'gray', transform: 'rotate(90deg)' };
  }
  const resultStyles = getStylesForResult();

  const shouldShowTriangle = prev !== undefined && prev !== null
    && curr !== prev;

  function getProfit() {
    if (prev === undefined || prev === null) {
      return '+0';
    }

    if (prev > curr) {
      return `${round(curr - prev, 1)}`;
    }
    return `+${round(curr - prev, 1)}`;
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2, }}>
      <Box sx={{ color: resultStyles.color, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ fontSize: 11 }}>
          Доход:
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ fontSize: 40, fontWeight: 'bold', marginRight: 0.5, }}>
            {round(curr, 1)}
          </Box>
          {shouldShowTriangle && (
            <Box sx={{fill: resultStyles.fill, transform: resultStyles.transform, marginRight: 0.5}}>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" width="531.74" height="460.5"
                   viewBox="0 0 531.74 460.5" overflow="visible" enableBackground="new 0 0 531.74 460.5"
                   style={{height: 25, width: 25}}>
                <polygon points="0.866,460 265.87,1 530.874,460 "/>
              </svg>
            </Box>
          )}
          <Box>
            {getProfit()}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Profit;
