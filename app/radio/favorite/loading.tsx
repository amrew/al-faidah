import { RadioListLoading } from "~/components/radio-list";

export default function FavoriteLoading() {
  return (
    <div className="flex flex-col p-4 md:p-8 gap-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">Radio Favorite</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <RadioListLoading count={4} />
      </div>
    </div>
  );
}
