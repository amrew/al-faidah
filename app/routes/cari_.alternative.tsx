import type { ArticleType } from "~/components/article/article-entity";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Pagination } from "~/components/pagination";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { SharedLayout } from "~/components/shared-layout";
import { TwoColumn } from "~/components/two-column";
import { Tab } from "~/components/tab";
import { TagsResult } from "~/components/tags-result";
import { ArticleList } from "~/components/article/article-list";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("q") || "";
  const page = Number(url.searchParams.get("page") || 1);

  const { supabase, response } = createServerSupabase(request);

  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  const normalizedKeyword = keyword.replace("+", " ");
  const searchParams = keyword.split("+").reduce((acc, cur) => {
    if (acc === "") return `'${cur}'`;
    return `${acc} | '${cur}'`;
  }, "");

  const [{ data: contents }, { count }, { data: taxonomies }] =
    await Promise.all([
      supabase
        .from("contents")
        .select<any, ArticleType>(
          `id, title, slug, summary, image, created_at, read_stats, terms, link,
          publishers( title, logo_url, web_url ), author`
        )
        .textSearch("fts", `${searchParams}`)
        .range(offset, offset + itemsPerPage - 1)
        .order("created_at", { ascending: false }),
      supabase
        .from("contents")
        .select("id", { count: "exact", head: true })
        .textSearch("fts", `${searchParams}`),
      supabase
        .from("taxonomies")
        .select<any, { id: string; slug: string; name: string }>(
          "id, name, slug"
        )
        // .eq("type", "category")
        .textSearch("name", `${searchParams}`)
        .range(0, 4)
        .order("created_at", { ascending: false }),
    ]);

  const totalPage = count ? Math.ceil(count / itemsPerPage) : 0;

  return json(
    {
      contents,
      taxonomies,
      page,
      totalPage,
      keyword,
      normalizedKeyword,
    },
    { headers: response.headers }
  );
};

export const meta: V2_MetaFunction = ({ data }) => {
  const { normalizedKeyword } = data;
  return [
    { title: `Pencarian '${normalizedKeyword}' - Al Faidah` },
    {
      name: "description",
      content:
        "Media dakwah Ahlus Sunnah Wal Jama'ah yang berisi bermacam-macam artikel, kajian, radio dan audio islami",
    },
  ];
};

export default function Articles() {
  const { contents, page, taxonomies, totalPage, keyword, normalizedKeyword } =
    useLoaderData<typeof loader>();

  return (
    <SharedLayout>
      <TwoColumn
        left={
          <>
            <h1 className="text-xl md:text-3xl mt-2 mb-4">
              Hasil pencarian <strong>{normalizedKeyword}</strong>
            </h1>
            <div className="sticky top-0 right-0 mb-4 pt-2 pb-2 bg-base-100">
              <Tab
                currentId="artikel"
                items={[
                  {
                    id: "artikel",
                    title: "Artikel",
                    href: `/cari/alternative?q=${keyword}`,
                  },
                  {
                    id: "publisher",
                    title: "Publisher",
                    href: `/cari/publisher?q=${keyword}`,
                  },
                  {
                    id: "tag",
                    title: "Tag",
                    href: `/cari/tag?q=${keyword}`,
                  },
                ]}
              />
            </div>

            {contents && contents.length > 0 ? (
              <ArticleList contents={contents} />
            ) : (
              <div>
                <p>Pastikan kata pencarian tidak salah ketik</p>
                <p>Coba kata lain</p>
                <p>Coba kata yang lebih umum</p>
              </div>
            )}
            <Pagination
              page={page}
              totalPage={totalPage}
              buildUrl={(page) => {
                let params: Record<string, string> = {};
                if (keyword) {
                  params.q = keyword;
                }
                if (page) {
                  params.page = String(page);
                }
                const searchParams = new URLSearchParams(params);
                return `/cari/artikel?${searchParams.toString()}`;
              }}
            />
          </>
        }
        right={
          taxonomies && taxonomies.length > 0 ? (
            <TagsResult items={taxonomies} keyword={keyword} />
          ) : null
        }
      />
    </SharedLayout>
  );
}
