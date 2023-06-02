import { useEffect, useState } from "react";

export function CountDownView(props: { countDown: number; onEnd: () => void }) {
  const [countDown, setCountDown] = useState<number>(props.countDown);

  const minutes = countDown ? Math.floor((countDown / 60) % 60) : 0;
  const seconds = countDown ? Math.floor(countDown % 60) : 0;

  useEffect(() => {
    if (typeof countDown !== "undefined") {
      const timeId = setInterval(() => {
        setCountDown((prev) => {
          const defined = typeof prev !== "undefined";
          if (defined && prev > 0) {
            return prev - 1;
          } else if (defined && prev === 0) {
            props.onEnd();
          }
          return 0;
        });
      }, 1000);
      return () => {
        clearInterval(timeId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <span className="countdown font-mono text-xs text-base-100">
        {/* @ts-ignore */}
        <span style={{ "--value": minutes }}></span>:
      </span>
      <span className="countdown font-mono text-xs text-base-100">
        {/* @ts-ignore */}
        <span style={{ "--value": seconds }}></span>
      </span>
    </div>
  );
}
