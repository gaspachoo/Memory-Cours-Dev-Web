import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

const Timer = forwardRef(({ gameStarted, gameEnded }, ref) => {
  const [gameTime, setGameTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameEnded) {
      timerRef.current = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameEnded]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setGameTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useImperativeHandle(ref, () => ({
    resetTimer,
    getTime: () => gameTime,
  }));

  return (
    <div className="stat-item">
      <span className="stat-label">⏱️ Temps :</span>
      <span className="stat-value">{formatTime(gameTime)}</span>
    </div>
  );
});

Timer.displayName = "Timer";

export { Timer };
