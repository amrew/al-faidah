export type RawTrackInfo = {
  uid_rad: string;
  uid_ref: string;
  id_radet: string;
  sc_rad: string;
  nama: string;
  status: string;
  info: string;
  pendengar: string;
  judul: string;
  logo: string;
  url: string;
  kab: string;
  prop: string;
  neg: string;
  alias: string;
};

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
