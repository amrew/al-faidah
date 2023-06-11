"use client";

import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { Howl } from "howler";
import { usePrevious } from "react-use";

type AudioTrack = {
  name: string;
  trackTitle: string;
  url: string;
  logoUrl: string;
};

export const AudioContext = createContext<{
  track: AudioTrack | undefined;
  isLoading: boolean;
  play: (track: AudioTrack) => void;
  stop: () => void;
  countDown?: number | undefined;
  setCountDown: Dispatch<SetStateAction<number | undefined>>;
}>({
  track: undefined,
  isLoading: false,
  play: () => {},
  stop: () => {},
  setCountDown: () => {},
});

export const useAudioContext = () => {
  return useContext(AudioContext);
};

export const AudioProvider = (props: PropsWithChildren) => {
  const [track, setTrack] = useState<AudioTrack>();
  const [isLoading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState<number>();
  const prevTrack = usePrevious(track);

  useEffect(() => {
    if (track?.url && track.url !== prevTrack?.url) {
      const trackUrl = track.url;

      const sound = new Howl({
        src: [trackUrl],
        html5: true,
        onload: () => {
          setLoading(false);
        },
      });

      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.trackTitle,
          artist: track.name,
          artwork: [
            {
              src: track.logoUrl,
              sizes: "48x48",
            },
          ],
        });

        const stopTrack = () => {
          setTrack(undefined);
        };

        navigator.mediaSession.setActionHandler("pause", () => {
          stopTrack();
        });
        navigator.mediaSession.setActionHandler("stop", () => {
          stopTrack();
        });
      }

      sound.play();
      setLoading(true);

      return () => {
        sound.stop();
        setLoading(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  return (
    <AudioContext.Provider
      value={{
        track,
        isLoading,
        countDown,
        setCountDown,
        play: (track) => setTrack(track),
        stop: () => setTrack(undefined),
      }}
    >
      {props.children}
    </AudioContext.Provider>
  );
};
