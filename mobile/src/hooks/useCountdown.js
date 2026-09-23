// countdown hook
import { useEffect, useMemo, useState } from 'react';

// use server time to reduce clock drift
export function useCountdown(targetDate, serverNow) {

   // calculate clock offsetttttttt
  const offset = useMemo(() => {
    if (!serverNow) {
      return 0;
    }

    return new Date(serverNow).getTime() - Date.now();
  }, [serverNow]);

  const [remainingMs, setRemainingMs] = useState(() => {
    if (!targetDate) {
      return 0;
    }

    return new Date(targetDate).getTime() - (Date.now() + offset);
  });

  useEffect(() => {
    if (!targetDate) {
      setRemainingMs(0);
      return undefined;
    }

    const tick = () => {
      setRemainingMs(new Date(targetDate).getTime() - (Date.now() + offset));
    };

    tick();
    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, [targetDate, offset]);

  return Math.max(remainingMs, 0);
}
