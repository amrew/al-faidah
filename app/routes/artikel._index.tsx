import { ArticleItem } from "~/components/article-item";
import type { ArticleSummaryType } from "~/components/article-entity";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Pagination } from "~/components/pagination";
import { createServerSupabase } from "~/clients/createServerSupabase";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Al Faidah - Kajian Islam" },
    {
      name: "description",
      content:
        "Media dakwah Ahlus Sunnah Wal Jama'ah yang berisi bermacam-macam artikel, kajian, radio dan audio islami",
    },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 1);

  const { supabase, response } = createServerSupabase(request);

  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  const [{ data: contents }, { count }] = await Promise.all([
    supabase
      .from("contents")
      .select<any, ArticleSummaryType>(
        "id, title, slug, summary, image, created_at, read_stats, taxonomies( slug, name ), publishers( title, logo_url, web_url )"
      )
      .range(offset, offset + itemsPerPage - 1)
      .order("created_at", { ascending: false }),
    supabase.from("contents").select("id", { count: "exact", head: true }),
  ]);

  const totalPage = count ? Math.ceil(count / itemsPerPage) : 0;

  return json(
    {
      contents,
      page,
      totalPage,
    },
    { headers: response.headers }
  );
};

export default function Articles() {
  const { contents, page, totalPage } = useLoaderData<typeof loader>();

  return (
    <>
      <main className="p-4 md:p-8 gap-4 grid grid-cols-1 md:grid-cols-2">
        {contents?.map((item) => (
          <ArticleItem
            key={item.id}
            title={item.title}
            isFullContent={false}
            content={item.summary}
            createdAt={item.created_at}
            readDuration={item.read_stats.minutes}
            category={{
              name: item.taxonomies.name,
              categoryUrl: `/kategori/${item.taxonomies.slug}`,
            }}
            author={{
              name: item.publishers.title,
              logoUrl: item.publishers.logo_url,
            }}
            detailUrl={`/artikel/${item.slug}`}
            imageUrl={item.image?.medium?.url}
          />
        ))}
      </main>
      <div className="flex justify-center mb-4 sm:mb-8">
        <Pagination
          page={page}
          totalPage={totalPage}
          buildUrl={(page) => `/artikel?page=${page}`}
        />
      </div>
    </>
  );
}
