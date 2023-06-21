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
  const track = radios.find((item) => item.alias === params.id);

  return (
    <main
      className="flex flex-col gap-2 h-full"
      data-theme={searchParams.theme}
    >
      <RadioList
        items={
          track ? [track] : radios.filter((item) => item.serial === params.id)
        }
        embed
      />
    </main>
  );
}
