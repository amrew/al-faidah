"use client";

import Image from "next/image";
import { useAudioContext } from "./audio-context";
import { BiStop, BiLoader } from "react-icons/bi";

export function Player() {
  const { track, stop, isLoading } = useAudioContext();
  return track ? (
    <div className="p-4 border-t border-t-yellow-300 bg-yellow-200 flex flex-1 flex-row gap-4 items-center">
      <Image
        src={track.logoUrl}
        width={64}
        height={64}
        className="w-12 h-12 rounded-md"
        alt={track.name}
      />
      <div className="flex-1">
        <h1 className="font-bold">{track.name}</h1>
        <p className="line-clamp-2">{track.trackTitle}</p>
      </div>
      <div>
        {!isLoading ? (
          <div className="playing">
            <span className="playing-bar playing-bar1"></span>
            <span className="playing-bar playing-bar2"></span>
            <span className="playing-bar playing-bar3"></span>
          </div>
        ) : null}
      </div>
      <div>
        <button className="btn btn-secondary" onClick={stop}>
          {isLoading ? (
            <BiLoader size={24} color="white" className="animate-spin" />
          ) : (
            <BiStop size={24} color="white" />
          )}
        </button>
      </div>
    </div>
  ) : null;
}
