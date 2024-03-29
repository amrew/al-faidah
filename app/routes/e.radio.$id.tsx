import { getAllTracks } from "~/components/radio/radio-service.server";
import { RadioList } from "~/components/radio/radio-list";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useQuery } from "react-query";
import { appConfig } from "~/utils/appConfig";

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const theme = url.searchParams.get("theme") || "rii";
  const mode = url.searchParams.get("mode") || "card";

  const id = params.id;
  const radios = await getAllTracks();
  const track = radios.find((item) => item.alias === id);

  if (!track) {
    throw new Response(null, {
      status: 404,
      statusText: "Radio tidak ditemukan",
    });
  }

  return json({
    id,
    track,
    theme,
    mode,
  });
};

export const meta: V2_MetaFunction = ({ data }) => {
  const { track } = data;
  return [
    { title: `${track.name} - ${appConfig.title}` },
    {
      name: "description",
      content: `${track.name}`,
    },
  ];
};

export default function RadioEmbed() {
  const {
    id,
    track: serverTrack,
    theme,
    mode,
  } = useLoaderData<typeof loader>();

  const query = useQuery(
    ["radio", id],
    async () => {
      const result = await fetch(`/api/radio/${id}`);
      const data = await result.json();
      return data;
    },
    {
      refetchInterval: 10000,
      initialData: {
        track: serverTrack,
      },
    }
  );

  return (
    <main
      className="flex flex-col items-center gap-2 h-full"
      data-theme={theme}
    >
      <div className="w-full sm:w-96 flex flex-col gap-2 p-2 overflow-y-auto h-full">
        <RadioList
          items={[query.data?.track]}
          embed
          mode={mode === "player" ? "player" : "card"}
          disabledRefreshInterval
          showAnimationOnItem={true}
          getDetailUrl={() => undefined}
        />
      </div>
    </main>
  );
}
