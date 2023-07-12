import { useAudioContext } from "./audio-context";
import {
  BiStop,
  BiLoader,
  BiTimer,
  BiArrowToLeft,
  BiArrowToRight,
} from "react-icons/bi";
import { PlayingAnimation } from "./playing-animation";
import { CountDownView } from "./countdown";
import { TimerModal } from "./modal-timer";
import { useState } from "react";

export function Player() {
  const {
    track,
    stop,
    prev,
    next,
    isLoading,
    countDown,
    setCountDown,
    duration,
  } = useAudioContext();
  const [toastShown, setToastShown] = useState(false);
  const hasTimer = typeof countDown !== "undefined";
  return track ? (
    <div className={`p-4 border-t border-t-secondary-focus bg-secondary`}>
      <div className="max-w-5xl mx-auto flex flex-1 flex-row gap-4 items-center">
        <img
          src={track.logoUrl}
          width={64}
          height={64}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-md"
          alt={track.name}
        />
        <div
          className={`flex-1 ${
            toastShown ? "tooltip tooltip-open text-left" : ""
          }`}
          data-tip={track.trackTitle}
          onClick={() => setToastShown((v) => !v)}
        >
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
          <CountDownView
            countDown={duration}
            updateCountDown={() => {}}
            onEnd={() => {}}
          />
        ) : null}
        <div>
          {!isLoading ? <PlayingAnimation className="bg-white" /> : null}
        </div>
        <div className="flex flex-row gap-2 items-center">
          <button className="btn btn-accent-content btn-sm" onClick={prev}>
            <BiArrowToLeft size={20} />
          </button>
          <button className="btn btn-accent-content" onClick={stop}>
            {isLoading ? (
              <BiLoader size={24} className="animate-spin text-content" />
            ) : (
              <BiStop size={24} className="text-content" />
            )}
          </button>
          <button className="btn btn-accent-content btn-sm" onClick={next}>
            <BiArrowToRight size={20} />
          </button>
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
