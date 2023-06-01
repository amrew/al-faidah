import { getTracks } from "../../../radio/service";
import { RadioItem } from "../../../radio/radio-item";

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
      {track ? <RadioItem item={track} embed /> : null}
    </main>
  );
}
