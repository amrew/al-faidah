import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";

type CountDownViewProps = {
  countDown: number;
  onEnd: () => void;
  updateCountDown: Dispatch<SetStateAction<number | undefined>>;
};

export function CountDownView(props: CountDownViewProps) {
  const { countDown, updateCountDown } = props;

  const minutes = countDown ? Math.floor((countDown / 60) % 60) : 0;
  const seconds = countDown ? Math.floor(countDown % 60) : 0;

  useEffect(() => {
    if (typeof countDown !== "undefined") {
      const timeId = setInterval(() => {
        updateCountDown((prev) => {
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
