import { getTracks } from "./service";
import { RadioList } from "./radio-list";

export default async function Home() {
  const radios = await getTracks();
  return (
    <main className="flex flex-col p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Radio</h1>
        <RadioList items={radios} />
      </div>
    </main>
  );
}
