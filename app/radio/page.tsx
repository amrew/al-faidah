import { get } from "@vercel/edge-config";
import { getTracks } from "~/components/radio-service";
import { RadioList } from "~/components/radio-list";

export default async function Home({
  searchParams,
}: {
  searchParams: { type: "rii" | "syariah" };
}) {
  const [radios, teachers, topics] = await Promise.all([
    getTracks({ type: searchParams.type }),
    get<{ name: string; keyword: string }[]>("teachers"),
    get<{ name: string; keyword: string }[]>("topics"),
  ]);
  return <RadioList items={radios} teachers={teachers} topics={topics} />;
}
