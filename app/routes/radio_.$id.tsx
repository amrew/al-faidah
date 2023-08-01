import { getTracks } from "~/components/radio-service";
import { RadioList } from "~/components/radio-list";
import { type LoaderArgs, json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SharedLayout } from "~/components/shared-layout";
import { useQuery } from "react-query";

export const loader = async ({ params }: LoaderArgs) => {
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
  });
};

export const meta: V2_MetaFunction = ({ data }) => {
  const { track } = data;
  return [
    { title: `${track.name} - Al Faidah` },
    {
      name: "description",
      content: track.name,
    },
  ];
};

export default function RadioDetail() {
  const { id, track: serverTrack } = useLoaderData<typeof loader>();

  const query = useQuery(
    ["radio", id],
    async () => {
      const result = await fetch(`/api/radio/${id}`);
      const data = await result.json();
      return data;
    },
    {
      refetchInterval: 5000,
      initialData: { track: serverTrack },
    }
  );

  return (
    <SharedLayout
      hasBackButton
      playerShown={false}
      bottomNavShown={false}
      contentStyle={{ height: "100%", paddingBottom: 0 }}
    >
      <main className="flex flex-col justify-center items-center flex-1 p-4 gap-4 h-full">
        <div className="max-w-lg h-full">
          <RadioList
            mode="player"
            items={[query.data?.track]}
            disabledRefreshInterval
          />
        </div>
      </main>
    </SharedLayout>
  );
}
