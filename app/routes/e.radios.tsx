import { getTracks } from "~/components/radio-service";
import { RadioList } from "~/components/radio-list";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useQuery } from "react-query";
import { Player } from "~/components/player";
import { useAudioContext } from "~/components/audio-context";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const theme = url.searchParams.get("theme") || "cupcake";
  const ids = url.searchParams.get("ids") || "";
  const idsArray = ids.split(" ");

  const radios = await getTracks();

  const items = radios.filter((item) => {
    return idsArray.includes(item.alias);
  });

  return json({
    ids,
    items,
    theme,
  });
};

export const meta: V2_MetaFunction = ({ data }) => {
  return [{ title: `Radio List - Al Faidah` }];
};

export default function RadiosEmbed() {
  const { ids, items: serverItems, theme } = useLoaderData<typeof loader>();
  const { track } = useAudioContext();

  const query = useQuery(
    ["radio", ids],
    async () => {
      const result = await fetch(`/api/tracks?ids=${ids}`);
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
