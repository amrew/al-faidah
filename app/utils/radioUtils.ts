import type { SortBy, TrackInfo } from "../components/radio/radio-entity";

export const sortRadios = (radios: TrackInfo[], sortBy: SortBy | undefined) => {
  if (sortBy === "live") {
    return [...radios].sort((a, b) =>
      a.status.toLowerCase() === "live" && b.status.toLowerCase() !== "live"
        ? -1
        : 1
    );
  } else if (sortBy === "most") {
    return [...radios].sort((a, b) =>
      a.listenerCount > b.listenerCount ? -1 : 1
    );
  } else if (sortBy === "less") {
    return [...radios].sort((a, b) =>
      a.listenerCount < b.listenerCount ? -1 : 1
    );
  } else {
    return radios;
  }
};
