import { getTracks } from "~/components/radio-service";
import { RadioList } from "~/components/radio-list";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const theme = url.searchParams.get("theme") || "cupcake";

  const id = params.id;
  const [riiRadios, syariahRadios] = await Promise.all([
    getTracks(),
    getTracks({ type: "syariah" }),
  ]);
  const radios = [...riiRadios, ...syariahRadios];
  const track = radios.find((item) => item.alias === id);
  const items = track ? [track] : radios.filter((item) => item.serial === id);

  if (!items.length) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return json({
    items,
    theme,
  });
};

export const meta: V2_MetaFunction = ({ data }) => {
  const { items } = data;
  const [first] = items || [];
  return [
    { title: `${first.name} - Al Faidah` },
    {
      name: "description",
      content: `${first.name}`,
    },
  ];
};

export default function RadioEmbed() {
  const { items, theme } = useLoaderData<typeof loader>();
  return (
    <main className="flex flex-col gap-2 h-full" data-theme={theme}>
      <RadioList items={items} embed />
    </main>
  );
}
