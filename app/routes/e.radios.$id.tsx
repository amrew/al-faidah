import { getAllTracks } from "~/components/radio-service";
import { RadioList } from "~/components/radio-list";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Player } from "~/components/player";
import { useAudioContext } from "~/components/audio-context";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { useQuery } from "react-query";

export const loader = async ({ request, params }: LoaderArgs) => {
  const id = params.id;

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Radio tidak ditemukan",
    });
  }

  const { supabase, response } = createServerSupabase(request);
  const [{ data: radio }, radios] = await Promise.all([
    await supabase
      .from("radios")
      .select("id, title, theme, items, header_shown")
      .eq("id", id)
      .single(),
    getAllTracks(),
  ]);

  const theme = radio?.theme || "cupcake";
  const ids = radio?.items || [];

  const mapIds: Record<string, boolean> = {};
  const items = radios.filter((item) => {
    if (mapIds[item.alias]) {
      return false;
    }
    const isExists = ids.includes(item.alias);
    if (isExists) {
      mapIds[item.alias] = true;
    }
    return isExists;
  });

  return json(
    {
      ids,
      items,
      radio,
      theme,
    },
    { headers: response.headers }
  );
};

export const meta: V2_MetaFunction = ({ data }) => {
  const { radio } = data;
  return [{ title: radio.title }];
};

export default function RadiosEmbed() {
  const { items: serverItems, radio, theme } = useLoaderData<typeof loader>();
  const { track } = useAudioContext();
  const ids = serverItems.map((item) => item.alias);

  const query = useQuery(
    ["radio", ids],
    async () => {
      const result = await fetch(`/api/radios?ids=${ids.join(",")}`);
      const data = await result.json();
      return data;
    },
    {
      refetchInterval: 10000,
      initialData: { items: serverItems },
    }
  );

  return (
    <main
      className={`flex flex-col items-center gap-2 h-full ${
        radio.header_shown ? "pt-16" : ""
      }`}
      data-theme={theme}
    >
      {radio.header_shown ? (
        <header className="navbar border-b border-solid gap-2 bg-base-200 border-b-base-300 fixed top-0 left-0 right-0 z-10">
          <div className={`flex-none px-4`}>
            <span className="font-bold text-lg">{radio.title}</span>
          </div>
        </header>
      ) : null}
      <div
        className="w-full sm:w-96 flex flex-col gap-2 p-2 overflow-y-auto"
        style={{ paddingBottom: track ? 85 : 8 }}
      >
        <RadioList
          items={query.data.items}
          embed
          disabledRefreshInterval
          getDetailUrl={() => undefined}
        />
      </div>
      <div className="fixed bottom-0 left-0 w-full">
        <Player />
      </div>
    </main>
  );
}
