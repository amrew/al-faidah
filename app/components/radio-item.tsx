import {
  BiHeadphone,
  BiPlay,
  BiStop,
  BiLoader,
  BiSkipPrevious,
  BiSkipNext,
} from "react-icons/bi";
import { BsBookmark, BsBookmarkFill, BsShare } from "react-icons/bs";
import { TbBookmarkPlus } from "react-icons/tb";
import { ImEmbed2 } from "react-icons/im";
import { RWebShare } from "react-web-share";
import type { TrackInfo } from "./radio-entity";
import { useAudioContext } from "./audio-context";
import { APP_URL } from "./utils";
import { PlayingAnimation } from "./playing-animation";
import { useEffect, useRef, useState } from "react";
import { Link } from "@remix-run/react";

export type RadioItemProps = {
  item: TrackInfo;
  embed?: boolean;
  isLiked?: boolean;
  canBeSaved?: boolean;
  toggleLikeLoading?: boolean;
  onEmbedClick?: () => void;
  onLikeClick?: () => void;
  onUnlikeClick?: () => void;
  type?: "small" | "big";
};

export function RadioItem({
  item,
  embed,
  isLiked,
  toggleLikeLoading,
  onEmbedClick,
  onLikeClick,
  onUnlikeClick,
  canBeSaved = true,
}: RadioItemProps) {
  const { track, play, stop, audioState } = useAudioContext();
  const isActive = track?.url === item.trackUrl;
  const isLive = item.status === "LIVE";

  const shareUrl = `${APP_URL}/radio/${item.alias}`;
  const shareDescription = `Yuk simak kajian: ${item.trackTitle} di ${item.name}`;

  const onStop = () => stop();
  const onPlay = () =>
    play({
      name: item.name,
      url: item.trackUrl,
      trackTitle: item.trackTitle,
      logoUrl: item.logoUrl,
      type: "streaming",
    });

  const headerNode = (
    <div className="flex flex-row gap-3">
      <img
        src={item.logoUrl}
        alt={item.name}
        className="w-10 h-10 rounded-md"
        width={80}
        height={80}
      />
      <div>
        <h2 className={`line-clamp-1 font-bold text-md text-base-content`}>
          {item.name}
        </h2>
        <div className={`flex flex-row items-center gap-1`}>
          <BiHeadphone size={16} className="text-base-content opacity-70" />{" "}
          <span className="text-sm text-base-content opacity-70">
            {item.listenerCount}
          </span>
        </div>
      </div>
      {isLive ? (
        <div className="mt-px">
          <span className="badge-error badge text-white">Live</span>
        </div>
      ) : null}
    </div>
  );

  const trackNode = (
    <p className={`line-clamp-2 text-md text-base-content`}>
      {item.trackTitle}
    </p>
  );

  return (
    <div
      className={`flex flex-1 flex-col border-base-300 rounded-md bg-base-100 shadow-sm ${
        embed ? "h-full justify-between border-4" : "border"
      }`}
    >
      <div className={`px-4 py-3 flex justify-between`}>
        <Link to={`/radio/${item.alias}`} target={embed ? "_blank" : "_self"}>
          {headerNode}
        </Link>
      </div>
      <div className="px-4 flex-1">{trackNode}</div>
      <div className={`px-4 py-3 flex justify-between`}>
        <div className="flex flex-row gap-2 items-center">
          {canBeSaved ? (
            !toggleLikeLoading && !embed ? (
              <button
                className={`btn btn-ghost btn-sm btn-circle`}
                onClick={isLiked ? onUnlikeClick : onLikeClick}
                aria-label={isLiked ? "Hilangkan Radio" : "Simpan Radio"}
              >
                {isLiked ? (
                  <BsBookmarkFill size={16} className="text-accent" />
                ) : (
                  <TbBookmarkPlus size={16} />
                )}
              </button>
            ) : !embed ? (
              <button className={`btn btn-ghost btn-sm btn-circle`}>
                <BiLoader size={12} />
              </button>
            ) : null
          ) : null}
          {onEmbedClick && !embed ? (
            <label
              htmlFor="modal-embed"
              onClick={onEmbedClick}
              className={`btn btn-ghost btn-sm btn-circle`}
            >
              <ImEmbed2 size={16} />
            </label>
          ) : null}
          <RWebShare
            data={{
              title: item.name,
              text: shareDescription,
              url: shareUrl,
            }}
            sites={["whatsapp", "telegram", "mail", "copy"]}
          >
            <button
              className={`btn btn-ghost btn-sm btn-circle`}
              aria-label="Share Radio"
            >
              <BsShare size={16} />
            </button>
          </RWebShare>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {audioState === "playing" && embed && isActive ? (
            <PlayingAnimation className="bg-accent" />
          ) : null}
          <button
            onClick={isActive ? onStop : onPlay}
            className={`btn btn-sm ${
              isActive ? "btn-secondary" : "btn-primary"
            }`}
            aria-label="Putar Radio"
          >
            {isActive && audioState === "loading" ? (
              <BiLoader size={24} color="white" className="animate-spin" />
            ) : isActive ? (
              <BiStop size={24} color="white" />
            ) : (
              <BiPlay size={24} color="white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RadioItemPlayer({ item, embed }: RadioItemProps) {
  const { track, play, stop, audioState } = useAudioContext();
  const isActive = track?.url === item.trackUrl;
  const isLive = item.status === "LIVE";

  const onStop = () => stop();

  const onPlay = () =>
    play({
      name: item.name,
      url: item.trackUrl,
      trackTitle: item.trackTitle,
      logoUrl: item.logoUrl,
      type: "streaming",
    });

  const [fakeProgress, setFakeProgress] = useState(0);
  const isReachMax = useRef<boolean>(false);

  useEffect(() => {
    if (audioState === "playing") {
      const id = setInterval(() => {
        setFakeProgress((prev) => {
          if (!isReachMax.current) {
            if (prev === 90) {
              isReachMax.current = true;
            }
            return prev + 10;
          } else {
            if (prev < 100) {
              return prev + 2;
            }
            return 96;
          }
        });
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }
  }, [audioState]);

  return (
    <div
      className={`w-full bg-base-200 h-full flex flex-col gap-4 ${
        embed ? "border-base-300 border-4" : ""
      }`}
    >
      <div className="flex flex-row bg-base-100 items-center gap-4 px-4 py-6 sm:px-8 sm:py-10 border-b border-b-base-300">
        <div className="sm:w-20">
          <div className="indicator">
            <span className="indicator-item badge badge-xs badge-success"></span>
            <div
              className={`badge badge-sm ${
                isLive ? "badge-error text-white" : ""
              }`}
            >
              {isLive ? "Live" : "Online"}
            </div>
          </div>
        </div>
        <div className="flex-1 text-center">
          <span className="font-bold line-clamp-1">{item.name}</span>
        </div>
        <div className="sm:w-20">
          <div className="flex flex-row items-center gap-2 justify-end">
            <BiHeadphone />
            <strong className="text-xs">{item.listenerCount}</strong>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-8 flex justify-center items-center flex-1">
        <img src={item.logoUrl} className="rounded-md" alt="" />
      </div>
      <div className="px-8 py-4 bg-base-100 flex flex-col gap-4 border-t border-t-base-300">
        <div className="text-center">
          <span className="font-semibold line-clamp-3">{item.trackTitle}</span>
        </div>
        <div className="text-center flex flex-col gap-4">
          <div className="px-4">
            <progress
              className="progress"
              value={fakeProgress}
              max="100"
            ></progress>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <button className="btn btn-primary btn-sm" disabled>
              <BiSkipPrevious size={24} color="white" />
            </button>
            <button
              onClick={isActive ? onStop : onPlay}
              className={`btn ${isActive ? "btn-secondary" : "btn-primary"}`}
              aria-label="Putar Radio"
            >
              {isActive && audioState === "loading" ? (
                <BiLoader size={24} color="white" className="animate-spin" />
              ) : isActive ? (
                <BiStop size={24} color="white" />
              ) : (
                <BiPlay size={24} color="white" />
              )}
            </button>
            <button className="btn btn-primary btn-sm" disabled>
              <BiSkipNext size={24} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RadioItemLoading() {
  return (
    <div
      className={`flex flex-1 flex-col border-base-300 rounded-md shadow-sm bg-base-100 border`}
    >
      <div className={`px-4 py-3 flex justify-between`}>
        <div className="flex flex-row gap-3">
          <div className="w-10 h-10 rounded-md bg-base-300" />
          <div>
            <h2
              className={`line-clamp-1 font-bold text-md w-32 sm:w-48 h-6 bg-base-300 animate-pulse`}
            />
            <div className={`flex flex-row items-center gap-1`}>
              <BiHeadphone size={16} className="text-gray-500" />{" "}
              <span className="text-sm text-gray-500">-</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 flex-1">
        <p
          className={`line-clamp-2 text-md text-base-content w-5/6 sm:w-48 h-12 bg-base-300  animate-pulse`}
        />
      </div>
      <div className={`px-4 py-3 flex justify-between`}>
        <div className="flex flex-row gap-2 items-center">
          <button className={`btn btn-ghost btn-sm btn-circle`}>
            <BsBookmark size={16} />
          </button>
          <label className={`btn btn-ghost btn-sm btn-circle`}>
            <ImEmbed2 size={16} />
          </label>
          <button className={`btn btn-ghost btn-sm btn-circle`}>
            <BsShare size={16} />
          </button>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <button className={`btn btn-sm btn-primary`} disabled>
            <BiPlay size={24} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
