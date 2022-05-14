import React, {useEffect, useRef, useState} from 'react';
import {Typography} from "@mui/material";

interface TimerProps {
  finishAt: number;
}

function Timer({ finishAt }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    let ignored = false;
    function tick() {
      if (ignored) return;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setTimeLeft(Math.max(finishAt - new Date().getTime(), 0));
      timerRef.current = setTimeout(() => {
        tick();
      }, 1000);
    }
    tick();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      ignored = true;
    }
  }, [finishAt]);

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  return (
    <>
      {minutes < 10 ? '0' : ''}{minutes}:{seconds < 10 ? '0' : ''}{seconds}
    </>
  )
}

export default Timer;
