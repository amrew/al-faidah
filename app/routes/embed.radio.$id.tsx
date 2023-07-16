import { getTracks } from "~/components/radio-service";
import { RadioList } from "~/components/radio-list";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useQuery } from "react-query";

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const theme = url.searchParams.get("theme") || "cupcake";
  const mode = url.searchParams.get("mode") || "card";

  const id = params.id;
  const [riiRadios, syariahRadios] = await Promise.all([
    getTracks(),
    getTracks({ type: "syariah" }),
  ]);
  const radios = [...riiRadios, ...syariahRadios];
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
    { title: `${track.name} - Al Faidah` },
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
      const result = await fetch(`/api/track/${id}`);
      const data = await result.json();
      return data;
    },
    {
      refetchInterval: 5000,
      initialData: { track: serverTrack },
    }
  );

  return (
    <main
      className="flex flex-col justify-center items-center gap-2 h-full"
      data-theme={theme}
    >
      <div className="h-full max-w-3xl">
        <RadioList
          items={[query.data?.track]}
          embed
          mode={mode === "player" ? "player" : "card"}
          disabledRefreshInterval
        />
      </div>
    </main>
  );
}
