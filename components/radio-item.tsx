"use client";

import Image from "next/image";
import { BiHeadphone, BiPlay, BiStop, BiLoader } from "react-icons/bi";
import { BsBookmark, BsBookmarkFill, BsShare } from "react-icons/bs";
import { ImEmbed2 } from "react-icons/im";
import { RWebShare } from "react-web-share";
import type { TrackInfo } from "./radio-entity";
import { useAudioContext } from "./audio-context";
import { APP_URL } from "./utils";
import { PlayingAnimation } from "./playing-animation";

export type RadioItemProps = {
  item: TrackInfo;
  embed?: boolean;
  isLiked?: boolean;
  toggleLikeLoading?: boolean;
  onEmbedClick?: () => void;
  onLikeClick?: () => void;
  onUnlikeClick?: () => void;
};

export function RadioItem({
  item,
  embed,
  isLiked,
  toggleLikeLoading,
  onEmbedClick,
  onLikeClick,
  onUnlikeClick,
}: RadioItemProps) {
  const { track, play, stop, isLoading } = useAudioContext();
  const isActive = track?.url === item.trackUrl;
  const isLive = item.status === "LIVE";

  const shareUrl = `${APP_URL}/radio/${item.serial}`;
  const shareDescription = `Yuk simak kajian: ${item.trackTitle} di ${item.name}`;

  const onStop = () => stop();
  const onPlay = () =>
    play({
      name: item.name,
      url: item.trackUrl,
      trackTitle: item.trackTitle,
      logoUrl: item.logoUrl,
    });

  return (
    <div
      className={`flex flex-1 flex-col border-base-300 rounded-md bg-base-100 ${
        embed ? "h-full justify-between border-4" : "border"
      }`}
      key={item.id}
    >
      <div className={`px-4 py-3 flex justify-between`}>
        <div className="flex flex-row gap-3">
          <Image
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
      </div>
      <div className="px-4 flex-1">
        <p className={`line-clamp-2 text-md text-base-content`}>
          {item.trackTitle}
        </p>
      </div>
      <div className={`px-4 py-3 flex justify-between`}>
        <div className="flex flex-row gap-2 items-center">
          {!toggleLikeLoading ? (
            <button
              className={`btn btn-ghost btn-sm btn-circle`}
              onClick={isLiked ? onUnlikeClick : onLikeClick}
            >
              {isLiked ? (
                <BsBookmarkFill size={16} className="text-accent" />
              ) : (
                <BsBookmark size={16} />
              )}
            </button>
          ) : (
            <button className={`btn btn-ghost btn-sm btn-circle`}>
              <BiLoader size={12} />
            </button>
          )}
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
            <button className={`btn btn-ghost btn-sm btn-circle`}>
              <BsShare size={16} />
            </button>
          </RWebShare>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {!isLoading && embed && isActive ? (
            <PlayingAnimation className="bg-accent" />
          ) : null}
          <button
            onClick={isActive ? onStop : onPlay}
            className={`btn btn-sm ${
              isActive ? "btn-secondary" : "btn-primary"
            }`}
          >
            {isActive && isLoading ? (
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

export function RadioItemLoading() {
  return (
    <div
      className={`flex flex-1 flex-col border-base-300 rounded-md bg-base-100 border`}
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
          className={`line-clamp-2 text-md text-base-content w-5/6 sm:w-48 md:w-72 h-12 bg-base-300  animate-pulse`}
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
