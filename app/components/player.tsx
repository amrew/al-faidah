import { useAudioContext } from "./audio/audio-context";
import {
  BiStop,
  BiLoader,
  BiTimer,
  BiArrowToLeft,
  BiArrowToRight,
  BiPlay,
  BiPause,
} from "react-icons/bi";
import { PlayingAnimation } from "./playing-animation";
import { CountDownView } from "./countdown";
import { TimerModal } from "./modal/modal-timer";
import { useState } from "react";
import { useDebounce } from "react-use";

export function Player() {
  const {
    track,
    stop,
    prev,
    next,
    audioState,
    countDown,
    maxDuration,
    setCountDown,
    duration,
    seek,
    pause,
    resume,
  } = useAudioContext();

  const hasTimer = typeof countDown !== "undefined";
  const [seekSecond, setSeekSecond] = useState<number>();

  useDebounce(
    () => {
      if (seekSecond) {
        seek(seekSecond);
        setSeekSecond(undefined);
      }
    },
    200,
    [seekSecond]
  );

  return track ? (
    <div className={`p-4 border-t border-t-neutral-focus bg-neutral relative`}>
      {track.type === "audio" && duration ? (
        <input
          type="range"
          min={0}
          max={maxDuration}
          value={seekSecond || duration}
          step={1}
          className="range range-xs rounded-none absolute left-0 w-full"
          style={{ top: -11 }}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setSeekSecond(value);
          }}
        />
      ) : null}
      <div className="max-w-5xl mx-auto flex flex-1 flex-row gap-4 items-center">
        <img
          loading="lazy"
          src={track.logoUrl}
          width={64}
          height={64}
          className="w-8 h-8 sm:w-12 sm:h-12 rounded-md"
          alt={track.name}
        />
        <div className="flex-1">
          <h1 className="font-bold sm:text-lg text-base-100 line-clamp-1">
            {track.name}
          </h1>
          <p className="line-clamp-1 text-sm sm:text-md text-base-100">
            {track.trackTitle}
          </p>
        </div>
        {track.type === "streaming" ? (
          hasTimer ? (
            <label htmlFor="timer-modal" className="btn btn-ghost btn-xs">
              <CountDownView
                countDown={countDown}
                updateCountDown={setCountDown}
                onEnd={stop}
              />
            </label>
          ) : (
            <label htmlFor="timer-modal" className="btn btn-xs btn-ghost">
              <BiTimer size={20} color="white" />
            </label>
          )
        ) : null}
        {duration ? (
          <div className="hidden sm:flex">
            <CountDownView
              countDown={maxDuration - duration}
              updateCountDown={() => {}}
              onEnd={() => {}}
            />
          </div>
        ) : null}
        {track.type === "streaming" && audioState === "playing" ? (
          <div>
            <PlayingAnimation className="bg-white" />
          </div>
        ) : null}
        <div className={`flex flex-row gap-1 sm:gap-2 items-center`}>
          {track.type === "audio" ? (
            <button
              className="btn btn-accent-content btn-xs sm:btn-sm"
              onClick={prev}
            >
              <BiArrowToLeft size={20} />
            </button>
          ) : null}
          <button
            className="btn btn-accent-content btn-sm sm:btn-md"
            onClick={stop}
          >
            {audioState === "loading" ? (
              <BiLoader size={24} className="animate-spin text-content" />
            ) : (
              <BiStop size={24} className="text-content" />
            )}
          </button>
          {track.type === "audio" &&
          audioState !== "stopped" &&
          audioState !== "loading" ? (
            <button
              className="btn btn-accent-content btn-sm sm:btn-md"
              onClick={audioState === "paused" ? resume : pause}
            >
              {audioState === "paused" ? (
                <BiPlay size={24} />
              ) : (
                <BiPause size={24} />
              )}
            </button>
          ) : null}
          {track.type === "audio" ? (
            <button
              className="btn btn-accent-content btn-xs sm:btn-sm"
              onClick={next}
            >
              <BiArrowToRight size={20} />
            </button>
          ) : null}
        </div>
      </div>
      <TimerModal
        hasTimer={hasTimer}
        onDisable={() => setCountDown(undefined)}
        onSubmit={(v) => {
          setCountDown(Number(v));
        }}
      />
    </div>
  ) : null;
}
