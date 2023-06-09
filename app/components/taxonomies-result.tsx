import { Link } from "@remix-run/react";

export type TaxonomiesResultProps = {
  items: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  keyword: string;
};

export function TaxonomiesResult(props: TaxonomiesResultProps) {
  const { items, keyword } = props;
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-lg">Topik ditemukan</h2>
      <div>
        <div className="flex flex-row flex-wrap gap-2">
          {items.map((item) => (
            <Link
              to={`/topik/${item.slug}`}
              key={item.id}
              className="btn btn-sm"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="mt-2">
          <Link to={`/cari/topik?q=${keyword}`} className="text-primary">
            Lihat semua
          </Link>
        </div>
      </div>
    </div>
  );
}
