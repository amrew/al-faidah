import { json, type LoaderArgs } from "@remix-run/node";
import { getAllTracks } from "~/components/radio-service";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.id;

  const radios = await getAllTracks();
  const track = radios.find((item) => item.alias === id);

  if (!track) {
    throw new Response(null, {
      status: 404,
      statusText: "Radio tidak ditemukan",
    });
  }

  return json({ track });
};
