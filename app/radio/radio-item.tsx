import Image from "next/image";
import {
  BiHeadphone,
  BiPlay,
  BiPause,
  BiBookmark,
  BiShareAlt,
  BiLoader,
} from "react-icons/bi";

export type RadioItemProps = {
  isActive: boolean;
  isLoading: boolean;
  item: {
    id: string;
    logoUrl: string;
    name: string;
    trackTitle: string;
    listenerCount: number;
    status: string;
  };
  onPlay: () => void;
  onStop: () => void;
};

export function RadioItem({
  item,
  isActive,
  onPlay,
  onStop,
  isLoading,
}: RadioItemProps) {
  const isLive = item.status === "LIVE";
  const backgroundColor = isActive ? "bg-secondary" : "bg-base-100";
  return (
    <div
      className={`${backgroundColor} shadow-sm flex flex-1 flex-col rounded-md overflow-hidden`}
      key={item.id}
    >
      <div className="flex flex-1 p-4 gap-4">
        <div className="flex flex-col flex-1 gap-2 justify-between">
          <div>
            <h2 className="line-clamp-1 font-bold text-lg">{item.name}</h2>
            <p className="line-clamp-3">{item.trackTitle}</p>
          </div>
          <div className="flex flex-row gap-4">
            <div
              className={`badge badge-outline flex flex-row items-center gap-2 ${
                isActive ? "bg-white" : ""
              }`}
            >
              <BiHeadphone /> {item.listenerCount}
            </div>
            <div
              className={`badge ${
                !isLive ? "badge-outline" : "badge-error"
              } flex flex-row items-center gap-2 ${isActive ? "bg-white" : ""}`}
            >
              {isLive ? "Live" : "Online"}
            </div>
          </div>
        </div>
        <div className="w-12 md:w-16 self-center">
          <figure>
            <Image
              src={item.logoUrl}
              alt={item.name}
              className="w-12 h-12 md:w-16 md:h-16 rounded-md"
              width={64}
              height={64}
            />
          </figure>
        </div>
      </div>
      <div
        className={`bg-gray-100 p-2 flex justify-between border-t ${
          isActive ? "border-t-secondary-focus" : "border-t-gray-200"
        }`}
      >
        <div className="flex flex-row gap-2">
          <button className={`btn btn-outline btn-square`}>
            <BiBookmark size={24} />
          </button>
          <button className="btn btn-outline btn-square">
            <BiShareAlt size={24} />
          </button>
        </div>
        <button
          onClick={isActive ? onStop : onPlay}
          className={`btn ${
            isActive ? "btn-secondary" : "btn-primary"
          } btn-square`}
        >
          {isActive && isLoading ? (
            <BiLoader size={24} color="white" className="animate-spin" />
          ) : isActive ? (
            <BiPause size={24} color="white" />
          ) : (
            <BiPlay size={24} color="white" />
          )}
        </button>
      </div>
    </div>
  );
}
