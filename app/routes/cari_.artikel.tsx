import { ArticleItem } from "~/components/article-item";
import type { ArticleSummaryType } from "~/components/article-entity";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Pagination } from "~/components/pagination";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { SharedLayout } from "~/components/shared-layout";
import { TwoColumn } from "~/components/two-column";
import { Tab } from "~/components/tab";
import { TaxonomiesResult } from "~/components/taxonomies-result";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("q") || "";
  const page = Number(url.searchParams.get("page") || 1);
  const type = "artikel";

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
        .select<any, ArticleSummaryType>(
          "id, title, slug, summary, image, created_at, read_stats, taxonomies( slug, name ), publishers( title, logo_url, web_url )"
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
      type,
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
  const {
    type,
    contents,
    page,
    taxonomies,
    totalPage,
    keyword,
    normalizedKeyword,
  } = useLoaderData<typeof loader>();

  return (
    <SharedLayout keyword={normalizedKeyword}>
      <TwoColumn
        left={
          <>
            <h1 className="text-xl md:text-3xl mt-2 mb-4">
              Hasil pencarian <strong>{normalizedKeyword}</strong>
            </h1>
            <div className="sticky top-0 right-0 mb-4 pt-2 pb-2 bg-base-100">
              <Tab
                currentId={type}
                items={[
                  {
                    id: "artikel",
                    title: "Artikel",
                    href: `/cari/artikel?q=${keyword}`,
                  },
                  {
                    id: "publisher",
                    title: "Publisher",
                    href: `/cari/publisher?q=${keyword}`,
                  },
                  {
                    id: "topik",
                    title: "Topik",
                    href: `/cari/topik?q=${keyword}`,
                  },
                ]}
              />
            </div>
            {contents && contents.length > 0 ? (
              contents.map((item) => (
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
              ))
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
                return `/cari/${type}?${searchParams.toString()}`;
              }}
            />
          </>
        }
        right={
          taxonomies && taxonomies.length > 0 ? (
            <TaxonomiesResult items={taxonomies} keyword={keyword} />
          ) : null
        }
      />
    </SharedLayout>
  );
}
