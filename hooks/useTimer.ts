
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerProps {
  initialTime: number;
  onComplete?: () => void;
}

export const useTimer = ({ initialTime, onComplete }: UseTimerProps) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);
  
  const reset = useCallback((newTime?: number) => {
    setIsActive(false);
    setTime(newTime ?? initialTime);
  }, [initialTime]);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsActive(false);
            onComplete?.();
            return 0;
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, onComplete]);

  return { time, isActive, start, pause, reset };
};
