import type { RadioInfo, TrackInfo } from "./radio-entity";
import { sortRadios } from "../../utils/radioUtils";

const RII_URL = process.env.RII_URL;
const SYARIAH_URL = process.env.SYARIAH_URL;
const RADIO_PROXY_URL = process.env.RADIO_PROXY_URL;

export async function getTracks(params?: {
  type?: "rii" | "syariah";
  sortBy?: "most" | "less" | "default";
}) {
  const { type = "rii", sortBy = "default" } = params || {};
  const url =
    type === "syariah"
      ? `${SYARIAH_URL}/rsy/list/v2jsyariah.php?listradio=syariah`
      : `${RII_URL}/radio/lrii.php?model=lima`;

  const result = await fetch(url);
  const data = await result.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tracks: TrackInfo[] = data.map((item: any) => {
    const parsed = item.url.split("//");
    const [ip, port] = parsed[1].split(":");
    return {
      id: item.uid_rad,
      alias: item.alias,
      serial: item.id_radet,
      name: item.nama,
      logoUrl: item.logo?.replace("http://", "https://"),
      listenerCount: Number(item.pendengar),
      status: item.status,
      trackTitle: item.judul,
      trackUrl: `${RADIO_PROXY_URL}/stations/${ip}/${port}/radio.mp3?sid=1`,
      statsUrl: `${RADIO_PROXY_URL}/stations/${ip}/${port}/stats?sid=1&json=1`,
    };
  });

  return sortRadios(tracks, sortBy);
}

export async function getAllTracks() {
  const [riiRadios, syariahRadios] = await Promise.all([
    getTracks(),
    getTracks({ type: "syariah" }),
  ]);
  return [...syariahRadios, ...riiRadios];
}

export async function getRadio(id: string) {
  const result = await fetch(`${RII_URL}/jupuk.php?ambil=radet&id_radet=${id}`);
  const data: RadioInfo[] = await result.json();
  return data.length > 0 ? data[0] : undefined;
}
