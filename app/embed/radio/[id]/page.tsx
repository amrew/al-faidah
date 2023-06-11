import { getTracks } from "~/components/radio-service";
import { RadioList } from "~/components/radio-list";

export const revalidate = 20;

export default async function RadioEmbed({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { theme: string };
}) {
  const radios = await getTracks();
  const track = radios.find((item) => item.serial === params.id);
  return (
    <main className="flex h-full" data-theme={searchParams.theme}>
      {track ? <RadioList items={[track]} /> : null}
    </main>
  );
}
