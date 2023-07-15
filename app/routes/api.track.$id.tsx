import { json, type LoaderArgs } from "@remix-run/node";
import { getTracks } from "~/components/radio-service";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.id;

  const radios = await getTracks();
  const track = radios.find((item) => item.alias === id);

  if (!track) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return json({ track });
};
