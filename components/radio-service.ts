import { get } from "@vercel/edge-config";
import { RadioInfo, TrackInfo } from "./radio-entity";
import { sortRadios } from "./utils";

const RII_URL = process.env.RII_URL;
const SYARIAH_URL = process.env.SYARIAH_URL;

export async function getTracks(params?: {
  type?: "rii" | "syariah";
  sortBy?: "most" | "less" | "default";
}) {
  const { type = "rii", sortBy = "default" } = params || {};
  const url =
    type === "syariah"
      ? `${SYARIAH_URL}/rsy/list/v2jsyariah.php?listradio=syariah`
      : `${RII_URL}/radio/lrii.php?model=lima`;

  const [result, proxyUrl] = await Promise.all([
    fetch(url, {
      next: { revalidate: 5 },
    }),
    get<string>("proxyUrl"),
  ]);

  const data = await result.json();

  const tracks: TrackInfo[] = data.map((item: any) => {
    const parsed = item.url.split("//");
    const [ip, port] = parsed[1].split(":");
    return {
      id: item.uid_rad,
      serial: item.id_radet,
      name: item.nama,
      logoUrl: item.logo,
      listenerCount: Number(item.pendengar),
      status: item.status,
      trackTitle: item.judul,
      trackUrl: `${proxyUrl}/radio/${ip}/${port}`,
    };
  });

  return sortRadios(tracks, sortBy);
}

export async function getRadio(id: string) {
  const result = await fetch(`${RII_URL}/jupuk.php?ambil=radet&id_radet=${id}`);
  const data: RadioInfo[] = await result.json();
  return data.length > 0 ? data[0] : undefined;
}
