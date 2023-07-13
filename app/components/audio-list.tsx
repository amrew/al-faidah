import { BiLoader, BiPause, BiPlay, BiStop } from "react-icons/bi";
import { useAudioContext } from "./audio-context";

export type AudioListProps = {
  audios: Array<{
    src: string;
    title: string;
    trackTitle: string;
    logoUrl: string;
  }>;
};

export function AudioList(props: AudioListProps) {
  const { audios } = props;
  const { play, stop, resume, pause, audioState, track } = useAudioContext();
  return (
    <div className="flex flex-col gap-4 sm:max-h-96 overflow-y-auto bg-base-300 p-4 rounded-md">
      {audios.map((item, i) => {
        const isActive = track?.url === item.src;
        const onPlay = () => {
          play(
            {
              url: item.src,
              name: item.title,
              logoUrl: item.logoUrl,
              trackTitle: item.trackTitle,
              type: "audio",
            },
            audios.map((item) => ({
              url: item.src,
              name: item.title,
              logoUrl: item.logoUrl,
              trackTitle: item.trackTitle,
              type: "audio",
            }))
          );
        };
        return (
          <div
            key={item.src}
            className="flex flex-row items-center bg-base-100 px-4 py-3 rounded-md shadow-sm gap-2"
          >
            <div className="flex flex-row items-center gap-4 flex-1">
              {audios.length > 1 ? (
                <div className="avatar placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-sm w-8">
                    <span className="text-xs">{i + 1}</span>
                  </div>
                </div>
              ) : null}
              <div className="line-clamp-2">{item.trackTitle}</div>
            </div>
            <div className="flex flex-row gap-2">
              <button
                className={`btn btn-primary btn-sm ${
                  isActive ? "btn-secondary" : "btn-primary"
                }`}
                onClick={isActive ? stop : onPlay}
              >
                {isActive && audioState === "loading" ? (
                  <BiLoader size={18} color="white" className="animate-spin" />
                ) : isActive ? (
                  <BiStop size={18} color="white" />
                ) : (
                  <BiPlay size={18} color="white" />
                )}
              </button>
              {isActive &&
              audioState !== "stopped" &&
              audioState !== "loading" ? (
                <button
                  className={`btn btn-sm ${
                    audioState === "paused" ? "btn-primary" : "btn-info"
                  }`}
                  onClick={audioState === "paused" ? resume : pause}
                >
                  {audioState === "paused" ? (
                    <BiPlay size={18} color="white" />
                  ) : (
                    <BiPause size={18} color="white" />
                  )}
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
