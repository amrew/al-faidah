import { RadioInfo, TrackInfo } from "./entity";

const API_URL = process.env.RII_URL;

export async function getTracks() {
  const result = await fetch(`${API_URL}/radio/lrii.php?model=lima`, {
    next: { revalidate: 5 },
  });
  const data: TrackInfo[] = await result.json();
  return data;
}

export async function getRadio(id: string) {
  const result = await fetch(`${API_URL}/jupuk.php?ambil=radet&id_radet=${id}`);
  const data: RadioInfo[] = await result.json();
  return data.length > 0 ? data[0] : undefined;
}
