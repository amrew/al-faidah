import { getAll } from "@vercel/edge-config";
import { getTracks } from "~/components/radio-service";
import { RadioListWithFilter } from "~/components/radio-list-with-filter";
import type { FilterOption } from "~/components/radio-entity";

export const revalidate = 20;

export default async function Home({
  searchParams,
}: {
  searchParams: { type: "rii" | "syariah" };
}) {
  const [radios, { teachers, topics }] = await Promise.all([
    getTracks({ type: searchParams.type }),
    getAll<{ teachers: FilterOption[]; topics: FilterOption[] }>([
      "teachers",
      "topics",
    ]),
  ]);
  return (
    <RadioListWithFilter items={radios} teachers={teachers} topics={topics} />
  );
}
