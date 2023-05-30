"use client";

import { PropsWithChildren, useContext, useEffect } from "react";
import { createContext, useState } from "react";
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
}>({
  track: undefined,
  isLoading: false,
  play: () => {},
  stop: () => {},
});

export const useAudioContext = () => {
  return useContext(AudioContext);
};

export const AudioProvider = (props: PropsWithChildren) => {
  const [track, setTrack] = useState<AudioTrack>();
  const [isLoading, setLoading] = useState(false);
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
        play: (track) => setTrack(track),
        stop: () => setTrack(undefined),
      }}
    >
      {props.children}
    </AudioContext.Provider>
  );
};
