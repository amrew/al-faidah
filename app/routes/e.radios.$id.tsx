import { getTracks } from "~/components/radio-service";
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
      .select("id, title, theme, items")
      .eq("id", id)
      .single(),
    getTracks(),
  ]);

  const theme = radio?.theme || "cupcake";
  const ids = radio?.items || [];

  const items = radios.filter((item) => {
    return ids.includes(item.alias);
  });

  return json(
    {
      ids,
      items,
      theme,
    },
    { headers: response.headers }
  );
};

export const meta: V2_MetaFunction = ({ data }) => {
  return [{ title: `Radio List - Al Faidah` }];
};

export default function RadiosEmbed() {
  const { items: serverItems, theme } = useLoaderData<typeof loader>();
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
      className="flex flex-col items-center gap-2 h-full"
      data-theme={theme}
    >
      <div
        className="w-full sm:w-80 flex flex-col gap-2 p-2 overflow-y-auto"
        style={{ paddingBottom: track ? 85 : 8 }}
      >
        <RadioList items={query.data.items} embed disabledRefreshInterval />
      </div>
      <div className="fixed bottom-0 left-0 w-full">
        <Player />
      </div>
    </main>
  );
}
