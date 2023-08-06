import { json, type LoaderArgs } from "@remix-run/node";
import { getAllTracks } from "~/components/radio-service";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const ids = url.searchParams.get("ids") || "";
  const idsArray = ids.split(",");

  const radios = await getAllTracks();

  const items = radios.filter((item) => {
    return idsArray.includes(item.alias);
  });

  return json({ items });
};
