import { getAll } from "@vercel/edge-config";
import { getTracks } from "~/components/radio-service";
import { RadioListWithFilter } from "~/components/radio-list-with-filter";
import type { FilterOption } from "~/components/radio-entity";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Radio Islam Indonesia - Al Faidah" },
    {
      name: "description",
      content: "Berisi kajian Asatidzah Ahlus Sunnah Wal Jama'ah",
    },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  const [radios, { teachers, topics }] = await Promise.all([
    getTracks({ type: type === "syariah" ? "syariah" : "rii" }),
    getAll<{ teachers: FilterOption[]; topics: FilterOption[] }>([
      "teachers",
      "topics",
    ]),
  ]);

  return json({
    radios,
    teachers,
    topics,
  });
};

export default function Radio() {
  const { radios, teachers, topics } = useLoaderData<typeof loader>();
  return (
    <RadioListWithFilter items={radios} teachers={teachers} topics={topics} />
  );
}
