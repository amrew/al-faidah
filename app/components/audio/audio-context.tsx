import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useState, useContext, useEffect, useRef } from "react";
import { Howl } from "howler";
import { usePrevious } from "react-use";

type AudioTrack = {
  type: "audio" | "streaming";
  name: string;
  trackTitle: string;
  url: string;
  logoUrl: string;
};

type AudioState = "stopped" | "loading" | "playing" | "paused";

export const AudioContext = createContext<{
  track: AudioTrack | undefined;
  audioState: AudioState;
  play: (track: AudioTrack, list?: Array<AudioTrack>) => void;
  stop: () => void;
  prev: () => void;
  next: () => void;
  pause: () => void;
  resume: () => void;
  seek: (second: number) => void;
  countDown?: number | undefined;
  setCountDown: Dispatch<SetStateAction<number | undefined>>;
  duration: number;
  maxDuration: number;
}>({
  track: undefined,
  audioState: "stopped",
  play: () => {},
  stop: () => {},
  prev: () => {},
  next: () => {},
  seek: () => {},
  pause: () => {},
  resume: () => {},
  setCountDown: () => {},
  duration: 0,
  maxDuration: 0,
});

export const useAudioContext = () => {
  return useContext(AudioContext);
};

export const AudioProvider = (props: PropsWithChildren) => {
  const [track, setTrack] = useState<AudioTrack>();
  const [trackList, setTrackList] = useState<Array<AudioTrack>>([]);

  const [audioState, setAudioState] = useState<AudioState>("stopped");
  const [metadata, setMetadata] = useState<{
    maxDuration: number;
    duration: number;
  }>({ maxDuration: 0, duration: 0 });

  const [countDown, setCountDown] = useState<number>();

  const prevTrack = usePrevious(track);
  const soundRef = useRef<Howl>();

  useEffect(() => {
    if (track?.url && track.url !== prevTrack?.url) {
      const trackUrl = track.url;

      soundRef.current = new Howl({
        src: [trackUrl],
        html5: true,
        onload: () => {
          if (track.type === "audio" && soundRef.current) {
            setMetadata({
              maxDuration: soundRef.current.duration(),
              duration: 0,
            });
          }
          setAudioState("playing");
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

      soundRef.current.play();
      setAudioState("loading");

      return () => {
        soundRef.current?.stop();
        setAudioState("stopped");
        setMetadata({
          maxDuration: 0,
          duration: 0,
        });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  useEffect(() => {
    if (audioState === "playing" && metadata.duration < metadata.maxDuration) {
      const id = setInterval(() => {
        setMetadata((prev) => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }
  }, [audioState]);

  const prev = () => {
    const currentTrackIndex = trackList.findIndex(
      (item) => item.url === track?.url
    );
    if (currentTrackIndex !== -1) {
      const prevTrack = trackList[currentTrackIndex - 1];
      if (prevTrack) {
        setTrack(prevTrack);
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

  const pause = () => {
    soundRef.current?.pause();
    setAudioState("paused");
  };

  const resume = () => {
    soundRef.current?.play();
    setAudioState("playing");
  };

  return (
    <AudioContext.Provider
      value={{
        track,
        prev,
        next,
        pause,
        resume,
        audioState,
        countDown,
        setCountDown,
        duration: metadata.duration,
        maxDuration: metadata.maxDuration,
        play: (track, list) => {
          setTrack(track);
          if (list) {
            setTrackList(list);
          } else {
            setTrackList([]);
          }
        },
        stop: () => setTrack(undefined),
        seek: (second) => {
          setMetadata((prev) => {
            soundRef.current?.seek(second);
            return {
              ...prev,
              duration: second,
            };
          });
        },
      }}
    >
      {props.children}
    </AudioContext.Provider>
  );
};
