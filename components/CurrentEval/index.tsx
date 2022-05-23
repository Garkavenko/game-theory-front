import { Box } from '@mui/material';
import React, {useEffect, useRef, useState } from 'react';

interface CurrentEvalProps {
  currentVal: number;
  prevVal: number;
}

function Prev({ val }: { val: number }) {
  const [prevVal, setPrevVal] = useState(val);
  return (
    <Box sx={{ fontSize: 15, fontWeight: 'bold', opacity: val ? 1 : 0, lineHeight: 1 }}>
      <span>{val || 0}</span>
    </Box>
  )
}

function CurrentEval({ currentVal: currentValProp, prevVal: prevValProp }: CurrentEvalProps) {
  const [prevVal, setPrevVal] = useState(prevValProp);
  const [currentVal, setCurrentVal] = useState(currentValProp);
  const [nextVal, setNextVal] = useState<number | null>(null);
  const firstEffectRef = useRef(true);

  useEffect(() => {
    if (firstEffectRef.current) {
      firstEffectRef.current = false;
      return;
    }
    setNextVal(currentValProp);
    setCurrentVal(prevValProp);

    const timerId = setTimeout(() => {
      setNextVal(null);
      setCurrentVal(currentValProp);
      setPrevVal(prevValProp);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    }
  }, [currentValProp, prevValProp]);

  const containerStyle = nextVal !== null ? { transition: '1s all' } : {};
  const prevValStyle = nextVal !== null ? { transform: 'translateY(-16px)', transition: '1s all' } : {};
  const currentValStyle = nextVal !== null ? { transform: 'translateY(-27px) scale(0.24)', color: '#1976d2', opacity: 0.6, transition: '1s all' } : {};
  const nextValStyle = nextVal !== null ? { transform: 'translateY(0px)', transition: '1s all' } : {};
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', transition: '1s all', borderColor: '#91d5ff', color: '#26366f', display: 'flex', flexDirection: 'column', alignItems: 'center', ...containerStyle }}>
      <Box sx={{ fontSize: 15, color: 'gray' }}>
        Текущая оценка:
      </Box>
      <Box sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center',  }}>
        <Box sx={{ fontSize: 12, color: '#1976d2', fontWeight: 'bold', position: 'relative', top: 4, opacity: prevVal ? 0.6 : 0, lineHeight: 1, ...prevValStyle }}>
          {prevVal || 0}
        </Box>
        <Box sx={{ fontSize: 50, fontWeight: 'bold', lineHeight: 1, color: '#1976d2', ...currentValStyle }}>
          {currentVal || '-'}
        </Box>
        <Box sx={{ fontSize: 50, fontWeight: 'bold', lineHeight: 1, color: '#1976d2', transform: 'translateY(50px)', position: 'absolute', bottom: 0, ...nextValStyle }}>
          {nextVal || '-'}
        </Box>
      </Box>
    </Box>
  )
}

export default CurrentEval;
