import { defer, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import {
  ArticleItemSmall,
  ArticleItemSmallLoading,
} from "~/components/article/article-item";
import { SharedLayout } from "~/components/shared-layout";
import type { ArticleType } from "~/components/article/article-entity";
import { Tab } from "~/components/tab";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Pagination } from "~/components/pagination";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { TwoColumn } from "~/components/two-column";
import { Suspense } from "react";
import { getArticleUrl } from "~/utils/linkUtils";
import { ArticleList } from "~/components/article/article-list";
import { Container } from "~/components/container";
import { getTracks } from "~/components/radio/radio-service.server";
import { RadioList } from "~/components/radio/radio-list";
import { BiChevronRight } from "react-icons/bi";
import { RadioItemLoading } from "~/components/radio/radio-item";
import { appConfig } from "~/utils/appConfig";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page") || 1);
  const publisher = url.searchParams.get("publisher") || "";

  const itemsPerPage = 15;
  const offset = (page - 1) * itemsPerPage;

  const { supabase, response } = createServerSupabase(request);

  const getContents = async () => {
    let query = supabase.from("contents").select<any, ArticleType>(
      `id, title, slug, summary, image, created_at, link, 
      read_stats, terms, publishers!inner( title, slug, logo_url, status ), 
      author`
    );

    if (publisher) {
      query = query.eq("publishers.slug", publisher);
    }

    return query
      .eq("publishers.status", "active")
      .range(offset, offset + itemsPerPage - 1)
      .order("created_at", { ascending: false });
  };

  const getContentCount = async () => {
    let query = supabase
      .from("contents")
      .select("id, publishers!inner( slug, status )", {
        count: "exact",
        head: true,
      });

    if (publisher) {
      query = query.eq("publishers.slug", publisher);
    }

    return query.eq("publishers.status", "active");
  };

  const getEditorPicks = async () => {
    return supabase
      .from("contents")
      .select<any, ArticleType>(
        `id, title, slug, read_stats, publishers!inner( title, slug, logo_url )`
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
      >("id, title, slug, logo_url")
      .eq("status", "active");
  };

  const getRecommendedTopics = async () => {
    return supabase
      .rpc("fetch_taxonomies_total_contents")
      .eq("type", "category")
      .order("total_contents", { ascending: false })
      .range(0, 5);
  };

  const [{ data: contents }, { count }, { data: publishers }] =
    await Promise.all([getContents(), getContentCount(), getPublishers()]);

  const totalPage = count ? Math.ceil(count / itemsPerPage) : 0;

  const getRadios = async () => {
    const radios = await getTracks({ sortBy: "most" });
    return radios.slice(0, 2);
  };

  return defer(
    {
      publisher,
      contents,
      publishers,
      page,
      totalPage,
      editorPicks: getEditorPicks(),
      recommendedTopics: getRecommendedTopics(),
      radios: getRadios(),
    },
    {
      headers: {
        ...response.headers,
        "Cache-Control":
          "public, max-age=60, s-maxage=120, stale-while-revalidate",
      },
    }
  );
};

export const meta: V2_MetaFunction = () => {
  return [
    { title: appConfig.title },
    {
      name: "description",
      content: appConfig.metaDescription,
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
    recommendedTopics: recommendedTopicsPromise,
    radios: radiosPromise,
  } = useLoaderData<typeof loader>();

  return (
    <SharedLayout disableContainer>
      <div
        className="hero mt-16 main-content"
        style={{
          backgroundImage: `url("${appConfig.backgroundUrl}")`,
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content flex-col text-neutral-content pt-16">
          <div className="flex flex-col items-center lg:flex-row gap-8">
            <div className="w-full sm:max-w-lg">
              <h1 className="mb-5 text-3xl sm:text-5xl font-bold">
                {appConfig.alias}
              </h1>
              <p className="mb-2 text-xl">{appConfig.description}</p>
              <p className="mb-5">{appConfig.subdescription}</p>
              <div className="flex flex-row gap-2">
                {appConfig.actionButton}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full lg:w-80 overflow-y-auto hide-scrollbar">
              <Suspense fallback={<RadiosFallback />}>
                <Await
                  resolve={radiosPromise}
                  errorElement={<RadiosFallback />}
                >
                  {(radios) => (
                    <RadioList
                      items={radios}
                      getDetailUrl={(item) => `/radio/${item.alias}}`}
                    />
                  )}
                </Await>
              </Suspense>
              <Link to="/radio" className="btn">
                Lihat Semua <BiChevronRight size={20} />
              </Link>
            </div>
          </div>
          <div className="h-8 w-full" id="content" />
        </div>
      </div>
      <Container className="mt-2 pb-36 sm:pb-24">
        <TwoColumn
          left={
            <>
              <div
                className="sticky right-0 mb-4 pt-2 pb-2 bg-base-100"
                style={{ top: 64, zIndex: 1 }}
              >
                <Tab
                  currentId={publisher}
                  items={[
                    { id: "", title: "Beranda", href: "/" },
                    ...(publishers?.map((item) => ({
                      id: item.slug,
                      title: item.title,
                      href: `/?publisher=${item.slug}#content`,
                    })) || []),
                  ]}
                />
              </div>
              <main>
                <ArticleList contents={contents || []} />
              </main>
              <Pagination
                page={page}
                totalPage={totalPage}
                buildUrl={(page) => {
                  const params: Record<string, string> = {};
                  if (publisher) {
                    params.publisher = publisher;
                  }
                  if (page) {
                    params.page = String(page);
                  }
                  const searchParams = new URLSearchParams(params);
                  return `/?${searchParams.toString()}#content`;
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
                    <Suspense fallback={<EditorPickFallback />}>
                      <Await
                        resolve={editorPicksPromise}
                        errorElement={<EditorPickFallback />}
                      >
                        {({ data: editorPicks }) =>
                          editorPicks?.map((item) => (
                            <ArticleItemSmall
                              key={item.id}
                              title={item.title}
                              slug={item.slug}
                              publisher={{
                                name: item.publishers?.title,
                                logoUrl: item.publishers?.logo_url,
                                slug: item.publishers?.slug,
                              }}
                              readDuration={item.read_stats?.minutes}
                              detailUrl={getArticleUrl({
                                publisherSlug: item.publishers.slug,
                                articleSlug: item.slug,
                              })}
                              link={item.link}
                              terms={item.terms}
                            />
                          ))
                        }
                      </Await>
                    </Suspense>
                  </div>
                  {/* <Link to="/" className="text-primary">
                    Lihat semua
                  </Link> */}
                </div>
              </div>
              {/* <div>
              <div className="alert p-4">
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
            </div> */}
              <h2 className="font-bold text-lg">Tag rekomendasi</h2>
              <div>
                <div className="flex flex-row flex-wrap gap-2">
                  <Suspense fallback={<RecommendedTopicFallback />}>
                    <Await
                      resolve={recommendedTopicsPromise}
                      errorElement={<RecommendedTopicFallback />}
                    >
                      {({ data: topics }) => {
                        return topics?.map(
                          (item: {
                            id: string;
                            slug: string;
                            name: string;
                            total_contents: number;
                          }) => (
                            <Link
                              to={`/tag/${item.slug}`}
                              key={item.slug}
                              className="btn btn-sm"
                            >
                              {item.name}
                            </Link>
                          )
                        );
                      }}
                    </Await>
                  </Suspense>
                </div>
                <div className="mt-2">
                  <Link to="/cari/tag?q=" className="text-primary">
                    Cari tag
                  </Link>
                </div>
              </div>
            </>
          }
        />
      </Container>
    </SharedLayout>
  );
}

const EditorPickFallback = () => {
  return [...Array(3)].map((_, i) => <ArticleItemSmallLoading key={i} />);
};

const RecommendedTopicFallback = () => {
  return [...Array(3)].map((_, i) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <button className="btn btn-sm" key={i}></button>
  ));
};

const RadiosFallback = () => {
  return [...Array(2)].map((_, i) => <RadioItemLoading key={i} />);
};
