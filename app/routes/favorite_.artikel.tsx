import type { ArticleType } from "~/components/article/article-entity";
import {
  json,
  type V2_MetaFunction,
  type LoaderArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { Pagination } from "~/components/pagination";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { SharedLayout } from "~/components/shared-layout";
import { TwoColumn } from "~/components/two-column";
import { Tab } from "~/components/tab";
import { ArticleList } from "~/components/article/article-list";
import { isLoggedIn } from "~/utils/authUtils.server";
import { appConfig } from "~/utils/appConfig";

export const loader = async ({ request }: LoaderArgs) => {
  const loggedIn = await isLoggedIn(request);
  if (!loggedIn) {
    return redirect(`/auth/login?messageType=favorite-page`);
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 1);

  const { supabase, response } = createServerSupabase(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;
  const { data: contentLikes } = await supabase
    .from("content_likes")
    .select("content_id")
    .eq("type", "article")
    .eq("user_id", user?.id);
  const contentIds =
    contentLikes?.map((contentLike) => contentLike.content_id) || [];

  const [{ data: contents }, { count }] = await Promise.all([
    supabase
      .from("contents")
      .select<any, ArticleType>(
        `id, title, slug, summary, image, created_at, read_stats, terms, link,
         publishers!inner( title, logo_url, web_url ), author`
      )
      .in("id", contentIds)
      .eq("status_id", 1)
      .eq("publishers.status_id", 1)
      .range(offset, offset + itemsPerPage - 1)
      .order("created_at", { ascending: false }),
    supabase
      .from("contents")
      .select("id", { count: "exact", head: true })
      .in("id", contentIds)
      .eq("status_id", 1)
      .eq("publishers.status_id", 1),
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

export const meta: V2_MetaFunction = ({ data }) => {
  return [{ title: `Artikel Favorite - ${appConfig.title}` }];
};

export default function FavoriteArticles() {
  const { contents, page, totalPage } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  return (
    <SharedLayout>
      <TwoColumn
        reversed
        left={
          <>
            <h1 className="text-xl md:text-3xl mt-2 mb-4">Disimpan</h1>
            <div className="sticky top-0 right-0 mb-4 pt-2 pb-2 bg-base-100">
              <Tab
                currentId="artikel"
                items={[
                  {
                    id: "radio",
                    title: "Radio",
                    href: `/favorite/radio`,
                  },
                  {
                    id: "artikel",
                    title: "Artikel",
                    href: `/favorite/artikel`,
                  },
                ]}
              />
            </div>
            <main>
              <ArticleList
                contents={contents || []}
                onUnlikeCallback={() => revalidate()}
              />
            </main>
            <Pagination
              page={page}
              totalPage={totalPage}
              buildUrl={(page) => {
                let params: Record<string, string> = {};
                if (page) {
                  params.page = String(page);
                }
                const searchParams = new URLSearchParams(params);
                return `/favorite/artikel?${searchParams.toString()}`;
              }}
            />
          </>
        }
        right={null}
      />
    </SharedLayout>
  );
}
