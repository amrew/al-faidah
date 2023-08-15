import { Link } from "@remix-run/react";

export type TagsResultProps = {
  items: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  keyword: string;
};

export function TagsResult(props: TagsResultProps) {
  const { items, keyword } = props;
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-lg">Tag ditemukan</h2>
      <div>
        <div className="flex flex-row flex-wrap gap-2">
          {items.map((item) => (
            <Link to={`/tag/${item.slug}`} key={item.id} className="btn btn-sm">
              {item.name}
            </Link>
          ))}
        </div>
        <div className="mt-2">
          <Link to={`/cari/tag?q=${keyword}`} className="text-primary">
            Lihat semua
          </Link>
        </div>
      </div>
    </div>
  );
}
