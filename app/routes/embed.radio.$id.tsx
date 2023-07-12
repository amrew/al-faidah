import { getTracks } from "~/components/radio-service";
import { RadioList } from "~/components/radio-list";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const theme = url.searchParams.get("theme") || "cupcake";

  const id = params.id;
  const riiRadios = await getTracks();
  const syariahRadios = await getTracks({ type: "syariah" });
  const radios = [...riiRadios, ...syariahRadios];
  const track = radios.find((item) => item.alias === id);

  return json({
    id,
    radios,
    track,
    theme,
  });
};

export const meta: V2_MetaFunction = ({ data }) => {
  const { track } = data;
  return [
    { title: `${track.name} - Radio Islam Indonesia` },
    {
      name: "description",
      content: `${track.name}`,
    },
  ];
};

export default function RadioEmbed() {
  const { id, track, radios, theme } = useLoaderData<typeof loader>();
  return (
    <main className="flex flex-col gap-2 h-full" data-theme={theme}>
      <RadioList
        items={track ? [track] : radios.filter((item) => item.serial === id)}
        embed
      />
    </main>
  );
}
