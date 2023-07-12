import { BiLoader, BiPlay, BiStop } from "react-icons/bi";
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
  const { play, stop, isLoading, track } = useAudioContext();
  return (
    <div className="flex flex-col gap-4 sm:max-h-96 overflow-y-auto bg-base-300 p-4 rounded-md">
      {audios.map((item) => {
        const isActive = track?.url === item.src;
        return (
          <div
            key={item.src}
            className="flex flex-row items-center bg-base-100 px-4 py-3 rounded-md shadow-sm"
          >
            <div className="flex flex-1">{item.trackTitle}</div>
            <div>
              <button
                className={`btn btn-primary btn-sm ${
                  isActive ? "btn-secondary" : "btn-primary"
                }`}
                onClick={
                  isActive
                    ? stop
                    : () => {
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
                      }
                }
              >
                {isActive && isLoading ? (
                  <BiLoader size={18} color="white" className="animate-spin" />
                ) : isActive ? (
                  <BiStop size={18} color="white" />
                ) : (
                  <BiPlay size={18} color="white" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
