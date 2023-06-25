import { getTracks } from "~/components/radio-service";
import { RadioList } from "~/components/radio-list";
import { type LoaderArgs, json, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  const radios = await getTracks({
    type: type === "syariah" ? "syariah" : "rii",
  });

  return json({
    radios,
  });
};

export const meta: V2_MetaFunction = () => {
  return [{ title: `Radio Favorite - Al Faidah` }];
};

export default function RadioFavorite() {
  const { radios } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col p-4 md:p-8 gap-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">Radio Favorite</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <RadioList items={radios} favorite />
      </div>
    </div>
  );
}
