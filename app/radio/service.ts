import { RadioInfo, TrackInfo } from "./entity";

const RII_URL = process.env.RII_URL;
const SYARIAH_URL = process.env.SYARIAH_URL;

export async function getTracks(params: { type?: "rii" | "syariah" } = {}) {
  const { type = "rii" } = params;
  const url =
    type === "syariah"
      ? `${SYARIAH_URL}/rsy/list/v2jsyariah.php?listradio=syariah`
      : `${RII_URL}/radio/lrii.php?model=lima`;

  const result = await fetch(url, {
    next: { revalidate: 5 },
  });
  const data: TrackInfo[] = await result.json();
  console.log(data);
  return data;
}

export async function getRadio(id: string) {
  const result = await fetch(`${RII_URL}/jupuk.php?ambil=radet&id_radet=${id}`);
  const data: RadioInfo[] = await result.json();
  return data.length > 0 ? data[0] : undefined;
}
