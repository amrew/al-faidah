import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { Howl } from "howler";
import { usePrevious } from "react-use";

type AudioTrack = {
  type: "audio" | "streaming";
  name: string;
  trackTitle: string;
  url: string;
  logoUrl: string;
};

export const AudioContext = createContext<{
  track: AudioTrack | undefined;
  isLoading: boolean;
  play: (track: AudioTrack, list?: Array<AudioTrack>) => void;
  stop: () => void;
  prev: () => void;
  next: () => void;
  countDown?: number | undefined;
  setCountDown: Dispatch<SetStateAction<number | undefined>>;
  duration: number;
}>({
  track: undefined,
  isLoading: false,
  play: () => {},
  stop: () => {},
  prev: () => {},
  next: () => {},
  setCountDown: () => {},
  duration: 0,
});

export const useAudioContext = () => {
  return useContext(AudioContext);
};

export const AudioProvider = (props: PropsWithChildren) => {
  const [track, setTrack] = useState<AudioTrack>();
  const [trackList, setTrackList] = useState<Array<AudioTrack>>([]);

  const [isLoading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState<number>();
  const [duration, setDuration] = useState<number>(0);
  const prevTrack = usePrevious(track);

  useEffect(() => {
    if (track?.url && track.url !== prevTrack?.url) {
      const trackUrl = track.url;

      const sound = new Howl({
        src: [trackUrl],
        html5: true,
        onload: () => {
          setLoading(false);
          if (track.type === "audio") {
            setDuration(sound.duration());
          }
        },
        onend: () => {
          if (trackList) {
            const currentTrackIndex = trackList.findIndex(
              (item) => item.url === trackUrl
            );
            const nextTrack = trackList[currentTrackIndex + 1];
            if (nextTrack) {
              setTrack(nextTrack);
            } else {
              setTrack(undefined);
            }
          }
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

  useEffect(() => {
    if (duration && track) {
      const id = setInterval(() => {
        setDuration((prev) => prev - 1);
      }, 1000);
      return () => {
        clearInterval(id);
      };
    } else {
      setDuration(0);
    }
  }, [duration, track]);

  const prev = () => {
    const currentTrackIndex = trackList.findIndex(
      (item) => item.url === track?.url
    );
    if (currentTrackIndex !== -1) {
      const nextTrack = trackList[currentTrackIndex - 1];
      if (nextTrack) {
        setTrack(nextTrack);
      }
    }
  };

  const next = () => {
    const currentTrackIndex = trackList.findIndex(
      (item) => item.url === track?.url
    );
    if (currentTrackIndex !== -1) {
      const nextTrack = trackList[currentTrackIndex + 1];
      if (nextTrack) {
        setTrack(nextTrack);
      }
    }
  };

  return (
    <AudioContext.Provider
      value={{
        track,
        isLoading,
        countDown,
        setCountDown,
        play: (track, list) => {
          setTrack(track);
          if (list) {
            setTrackList(list);
          } else {
            setTrackList([]);
          }
        },
        stop: () => setTrack(undefined),
        prev,
        next,
        duration,
      }}
    >
      {props.children}
    </AudioContext.Provider>
  );
};
