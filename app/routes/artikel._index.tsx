import type { ArticleType } from "~/components/article/article-entity";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Pagination } from "~/components/pagination";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { ArticleList } from "~/components/article/article-list";

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
      .select<any, ArticleType>(
        `id, title, slug, summary, image, created_at, link, 
        read_stats, taxonomies( slug, name ), publishers!inner( title, slug, logo_url, web_url ), 
        author`
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
        <ArticleList contents={contents || []} />
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
