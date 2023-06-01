"use client";

import Image from "next/image";
import { useAudioContext } from "./audio-context";
import { BiStop, BiLoader, BiTimer } from "react-icons/bi";
import { useEffect, useState } from "react";
import { PlayingAnimation } from "./playing-animation";

function CountDownView(props: { countDown: number; onEnd: () => void }) {
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

const timerOptions = [
  {
    title: "10 Menit",
    value: `${10 * 60}`,
  },
  {
    title: "20 Menit",
    value: `${20 * 60}`,
  },
  {
    title: "30 Menit",
    value: `${30 * 60}`,
  },
];

export function TimerModal(props: { onSubmit: (v: string) => void }) {
  const [time, setTime] = useState<string>();
  return (
    <>
      <input type="checkbox" id="timer-modal" className="modal-toggle" />
      <div className="modal z-10">
        <div className="modal-box max-w-xs">
          <h3 className="font-bold text-xl">Timer</h3>
          <div className="py-4">
            <p>Lagi dengerin taklim terus ketiduran?</p>
            <p>Atur waktu kapan radio akan dimatikan.</p>
          </div>
          {timerOptions.map((item) => (
            <div className="form-control" key={item.value}>
              <label className="label cursor-pointer">
                <span className="label-text">{item.title}</span>
                <input
                  type="radio"
                  name="timer-value"
                  className="radio checked:bg-primary"
                  checked={time === item.value}
                  onChange={() => {
                    setTime(item.value);
                  }}
                  value={item.value}
                />
              </label>
            </div>
          ))}
          <div className="modal-action">
            <label htmlFor={"timer-modal"} className="btn btn-outline btn-sm">
              Batal
            </label>
            <label
              htmlFor={time ? "timer-modal" : ""}
              className={`btn btn-primary btn-sm ${
                !time ? "btn-disabled" : ""
              }`}
              onClick={() => (time ? props.onSubmit(time) : undefined)}
            >
              Aktifkan
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export function Player() {
  const { track, stop, isLoading } = useAudioContext();
  const [countDown, setCountDown] = useState<number>();
  const hasTimer = typeof countDown !== "undefined";

  useEffect(() => {
    setCountDown(undefined);
  }, [track]);

  return track ? (
    <>
      <div className="p-4 border-t border-t-secondary-focus bg-secondary flex flex-1 flex-row gap-4 items-center">
        <Image
          src={track.logoUrl}
          width={64}
          height={64}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-md"
          alt={track.name}
        />
        <div className="flex-1">
          <h1 className="font-bold sm:text-lg text-base-100 line-clamp-1">
            {track.name}
          </h1>
          <p className="line-clamp-2 text-sm sm:text-md text-base-100">
            {track.trackTitle}
          </p>
        </div>
        {!isLoading && hasTimer ? (
          <CountDownView countDown={countDown} onEnd={stop} />
        ) : (
          <label
            htmlFor="timer-modal"
            className="btn btn-xs sm:btn-sm btn-ghost"
          >
            <BiTimer size={20} color="white" />
          </label>
        )}
        <div>{!isLoading ? <PlayingAnimation /> : null}</div>
        <div>
          <button className="btn btn-accent-content" onClick={stop}>
            {isLoading ? (
              <BiLoader size={24} color="white" className="animate-spin" />
            ) : (
              <BiStop size={24} color="white" />
            )}
          </button>
        </div>
      </div>
      <TimerModal
        onSubmit={(v) => {
          setCountDown(Number(v));
        }}
      />
    </>
  ) : null;
}
