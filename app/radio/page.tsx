import { get } from "@vercel/edge-config";
import { getTracks } from "./service";
import { RadioList } from "./radio-list";

export default async function Home() {
  const [radios, teachers, topics] = await Promise.all([
    getTracks(),
    get<{ name: string; keyword: string }[]>("teachers"),
    get<{ name: string; keyword: string }[]>("topics"),
  ]);
  return (
    <main className="flex flex-col p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Radio</h1>
        <RadioList items={radios} teachers={teachers} topics={topics} />
      </div>
    </main>
  );
}
