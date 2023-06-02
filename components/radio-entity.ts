export type TrackInfo = {
  id: string;
  serial: string;
  name: string;
  logoUrl: string;
  listenerCount: number;
  status: string;
  trackTitle: string;
  trackUrl: string;
};

export type SortBy = "most" | "less" | "default";

export type RadioInfo = {
  nama_rad: string;
  alamat_rad: string;
  latlng_rad: string;
  zona_radio: string;
  web: string;
  email: string;
  chanel: string;
  telegram: string;
  pembimbing: string;
  about: string;
  imgnya: string;
  prop: string;
};

export type FilterOption = {
  name: string;
  keyword: string;
};
