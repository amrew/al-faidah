"use client";

import Image from "next/image";
import { useAudioContext } from "./audio-context";
import { BiStop, BiLoader, BiTimer } from "react-icons/bi";
import { useEffect, useState } from "react";
import { PlayingAnimation } from "./playing-animation";
import { CountDownView } from "./countdown";
import { TimerModal } from "./modal-timer";

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
        <div>
          {!isLoading ? <PlayingAnimation className="bg-white" /> : null}
        </div>
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
