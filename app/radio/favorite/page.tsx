import { getTracks } from "~/components/radio-service";
import { RadioList } from "~/components/radio-list";

export const revalidate = 10;

export default async function RadioFavorite({
  searchParams,
}: {
  searchParams: { type: "rii" | "syariah" };
}) {
  const radios = await getTracks({
    type: searchParams.type,
  });
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
