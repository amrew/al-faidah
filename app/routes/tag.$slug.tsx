import { defer, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { SharedLayout } from "~/components/shared-layout";
import type { ArticleType } from "~/components/article/article-entity";
import { Link, useLoaderData } from "@remix-run/react";
import { Pagination } from "~/components/pagination";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { TwoColumn } from "~/components/two-column";
import { ArticleList } from "~/components/article/article-list";
import { appConfig } from "~/utils/appConfig";

export const loader = async ({ request, params }: LoaderArgs) => {
  const topicSlug = params.slug;
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page") || 1);

  const itemsPerPage = 20;
  const offset = (page - 1) * itemsPerPage;

  const { supabase, response } = createServerSupabase(request);

  const getTopic = async () => {
    return supabase
      .from("taxonomies")
      .select("id, name, slug")
      .eq("slug", topicSlug)
      .single();
  };

  const getSimilarTopics = async () => {
    return supabase
      .from("taxonomies")
      .select()
      .textSearch("slug", `'${topicSlug}'`);
  };

  const getContents = async () => {
    let query = supabase.from("contents").select<any, ArticleType>(
      `id, title, slug, summary, image, created_at, link, 
      read_stats, terms, publishers!inner( title, slug, logo_url, web_url, status_id ), 
      author`
    );

    if (topicSlug) {
      query = query.contains("terms", [topicSlug]);
    }

    return query
      .eq("publishers.status_id", 1)
      .eq("status_id", 1)
      .range(offset, offset + itemsPerPage - 1)
      .order("created_at", { ascending: false });
  };

  const getContentCount = async () => {
    let query = supabase
      .from("contents")
      .select("id, publishers!inner( slug, status_id )", {
        count: "exact",
        head: true,
      });

    if (topicSlug) {
      query = query.contains("terms", [topicSlug]);
    }

    return query.eq("publishers.status_id", 1).eq("status_id", 1);
  };

  const [
    { data: contents },
    { count },
    { data: topic },
    { data: similarTopics },
  ] = await Promise.all([
    getContents(),
    getContentCount(),
    getTopic(),
    getSimilarTopics(),
  ]);

  const totalPage = count ? Math.ceil(count / itemsPerPage) : 0;

  return defer(
    {
      contents,
      page,
      totalPage,
      topic,
      similarTopics,
    },
    {
      headers: response.headers,
    }
  );
};

export const meta: V2_MetaFunction = ({ data }) => {
  const { topic } = data;
  return [
    { title: `${topic.name} - ${appConfig.title}` },
    {
      name: "description",
      content: `Artikel yang berkaitan dengan ${topic.name}`,
    },
  ];
};

export default function Index() {
  const { topic, contents, page, totalPage, similarTopics } =
    useLoaderData<typeof loader>();

  return (
    <SharedLayout>
      <TwoColumn
        left={
          <>
            <div
              className="sticky right-0 mb-4 pt-2 pb-2 bg-base-100"
              style={{ top: 64, zIndex: 1 }}
            >
              <h1 className="text-2xl font-bold">{topic?.name}</h1>
            </div>
            <main>
              <ArticleList contents={contents || []} />
            </main>
            <Pagination
              page={page}
              totalPage={totalPage}
              buildUrl={(page) => {
                const params: Record<string, string> = {};
                if (page) {
                  params.page = String(page);
                }
                const searchParams = new URLSearchParams(params);
                return `/tag/${topic?.slug}?${searchParams.toString()}`;
              }}
            />
          </>
        }
        right={
          <>
            <h2 className="font-bold text-lg">Tag Terkait</h2>
            <div>
              <div className="flex flex-row flex-wrap gap-2">
                {similarTopics?.map((topic) => (
                  <Link
                    to={`/tag/${topic.slug}`}
                    key={topic.slug}
                    className="btn btn-sm"
                  >
                    {topic.name.replace(/&amp;/g, "&")}
                  </Link>
                ))}
              </div>
            </div>
          </>
        }
      />
    </SharedLayout>
  );
}
