import { getAll } from "@vercel/edge-config";
import { getTracks } from "~/components/radio-service";
import { RadioListWithFilter } from "~/components/radio-list-with-filter";

type NameKeywordType = { name: string; keyword: string };

export const revalidate = 10;

export default async function Home({
  searchParams,
}: {
  searchParams: { type: "rii" | "syariah" };
}) {
  const [radios, { teachers, topics }] = await Promise.all([
    getTracks({ type: searchParams.type }),
    getAll<{ teachers: NameKeywordType[]; topics: NameKeywordType[] }>([
      "teachers",
      "topics",
    ]),
  ]);
  return (
    <RadioListWithFilter items={radios} teachers={teachers} topics={topics} />
  );
}
