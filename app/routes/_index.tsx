import { defer, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import {
  ArticleItem,
  ArticleItemSmall,
  ArticleItemSmallLoading,
} from "~/components/article-item";
import { SharedLayout } from "~/components/shared-layout";
import type { ArticleSummaryType } from "~/components/article-entity";
import { Tab } from "~/components/tab";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Pagination } from "~/components/pagination";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { TwoColumn } from "~/components/two-column";
import { Suspense } from "react";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page") || 1);
  const publisher = url.searchParams.get("publisher") || "";

  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  const { supabase, response } = createServerSupabase(request);

  const getContents = async () => {
    let query = supabase.from("contents").select<any, ArticleSummaryType>(
      `id, title, slug, summary, image, created_at, 
      read_stats, taxonomies( slug, name ), publishers!inner( title, slug, logo_url, web_url )`
    );

    if (publisher) {
      query = query.eq("publishers.slug", publisher);
    }

    return query
      .range(offset, offset + itemsPerPage - 1)
      .order("created_at", { ascending: false });
  };

  const getContentCount = async () => {
    let query = supabase
      .from("contents")
      .select("id, publishers!inner( slug )", { count: "exact", head: true });

    if (publisher) {
      return query.eq("publishers.slug", publisher);
    }

    return query;
  };

  const getEditorPicks = async () => {
    return supabase
      .from("contents")
      .select<any, ArticleSummaryType>(
        `id, title, slug, read_stats, taxonomies( slug, name ), publishers!inner( title, slug, logo_url )`
      )
      .eq("recommended", 1)
      .range(0, 2)
      .order("created_at", { ascending: false });
  };

  const getPublishers = async () => {
    return supabase
      .from("publishers")
      .select<
        any,
        { id: number; title: string; slug: string; logo_url: string }
      >("id, title, slug, logo_url");
  };

  const [{ data: contents }, { count }, { data: publishers }] =
    await Promise.all([getContents(), getContentCount(), getPublishers()]);

  const totalPage = count ? Math.ceil(count / itemsPerPage) : 0;

  return defer(
    {
      publisher,
      contents,
      publishers,
      page,
      totalPage,
      editorPicks: getEditorPicks(),
    },
    {
      headers: response.headers,
    }
  );
};

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

export default function Index() {
  const {
    publisher,
    contents,
    publishers,
    page,
    totalPage,
    editorPicks: editorPicksPromise,
  } = useLoaderData<typeof loader>();

  return (
    <SharedLayout>
      <TwoColumn
        left={
          <>
            <div className="sticky top-0 right-0 mb-4 pt-2 pb-2 bg-base-100">
              <Tab
                currentId={publisher}
                items={[
                  { id: "", title: "Beranda", href: "/" },
                  ...(publishers?.map((item) => ({
                    id: item.slug,
                    title: item.title,
                    href: `/?publisher=${item.slug}`,
                  })) || []),
                ]}
              />
            </div>
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
            <Pagination
              page={page}
              totalPage={totalPage}
              buildUrl={(page) => {
                let params: Record<string, string> = {};
                if (publisher) {
                  params.publisher = publisher;
                }
                if (page) {
                  params.page = String(page);
                }
                const searchParams = new URLSearchParams(params);
                return `/?${searchParams.toString()}`;
              }}
            />
          </>
        }
        right={
          <>
            <div>
              <h2 className="font-bold text-lg">Pilihan Editor</h2>
              <div className="mt-2">
                <div className="flex flex-col gap-2">
                  <Suspense
                    fallback={[...Array(3)].map((_, i) => (
                      <ArticleItemSmallLoading key={i} />
                    ))}
                  >
                    <Await resolve={editorPicksPromise}>
                      {({ data: editorPicks }) =>
                        editorPicks?.map((item) => (
                          <ArticleItemSmall
                            key={item.id}
                            title={item.title}
                            author={{
                              name: item.publishers?.title,
                              logoUrl: item.publishers?.logo_url,
                            }}
                            readDuration={item.read_stats?.minutes}
                            detailUrl={`/artikel/${item.slug}`}
                            category={{
                              name: item.taxonomies?.name,
                              categoryUrl: `/kategori/${item.taxonomies?.slug}`,
                            }}
                          />
                        ))
                      }
                    </Await>
                  </Suspense>
                </div>
                <Link to="/" className="text-primary">
                  Lihat semua
                </Link>
              </div>
            </div>
            <div>
              <div className="alert p-8">
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-xl">Menulis di Al-Faidah</h3>
                  <div className="text-md">
                    Asah kreatifitas dan sebarkan ilmu yang bermanfaat.
                  </div>
                  <div>
                    <button className="btn btn-accent">Jadi Penulis</button>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="font-bold text-lg">Topik rekomendasi</h2>
            <div>
              <div className="flex flex-row flex-wrap gap-2">
                <button className="btn btn-sm">Sholat</button>
                <button className="btn btn-sm">Puasa</button>
                <button className="btn btn-sm">Zakat</button>
                <button className="btn btn-sm">Aqidah</button>
                <button className="btn btn-sm">Akhlak</button>
              </div>
              <div className="mt-2">
                <Link to="/" className="text-primary">
                  Lihat semua topik
                </Link>
              </div>
            </div>
          </>
        }
      />
    </SharedLayout>
  );
}
