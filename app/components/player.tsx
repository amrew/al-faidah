import { useAudioContext } from "./audio-context";
import { BiStop, BiLoader, BiTimer } from "react-icons/bi";
import { PlayingAnimation } from "./playing-animation";
import { CountDownView } from "./countdown";
import { TimerModal } from "./modal-timer";

export function Player() {
  const { track, stop, isLoading, countDown, setCountDown } = useAudioContext();
  const hasTimer = typeof countDown !== "undefined";
  return track ? (
    <>
      <div className="p-4 border-t border-t-secondary-focus bg-secondary flex flex-1 flex-row gap-4 items-center">
        <img
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
        {hasTimer ? (
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
        )}
        <div>
          {!isLoading ? <PlayingAnimation className="bg-white" /> : null}
        </div>
        <div>
          <button className="btn btn-accent-content" onClick={stop}>
            {isLoading ? (
              <BiLoader size={24} className="animate-spin text-content" />
            ) : (
              <BiStop size={24} className="text-content" />
            )}
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
    </>
  ) : null;
}
