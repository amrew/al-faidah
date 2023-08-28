import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ArticleType } from "~/components/article/article-entity";
import { ArticleDetail } from "~/components/article/article-item";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { SharedLayout } from "~/components/shared-layout";
import { appConfig } from "~/utils/appConfig";

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug;
  const publisherSlug = params.publisher;

  const { supabase, response } = createServerSupabase(request);

  const [{ data: item }] = await Promise.all([
    supabase
      .from("contents")
      .select<any, ArticleType>(
        `id, title, slug, summary, description, link, image, created_at, 
        read_stats, terms, publishers!inner( title, logo_url, web_url, slug, status_id ),
        author, metadata, gpt`
      )
      .eq("slug", slug)
      .eq("status_id", 1)
      .eq("publishers.slug", publisherSlug)
      .eq("publishers.status_id", 1)
      .single(),
  ]);

  if (!item) {
    throw new Response(null, {
      status: 404,
      statusText: "Artikel tidak ditemukan",
    });
  }

  return json(
    {
      item,
    },
    { headers: response.headers }
  );
};

export const meta: V2_MetaFunction = ({ data }) => {
  const { item } = data;
  return [
    { title: `${item.title} - ${appConfig.title}` },
    {
      name: "description",
      content: item.summary,
    },
    {
      tagName: "link",
      rel: "canonical",
      href: item.link,
    },
  ];
};

export default function Detail() {
  const { item } = useLoaderData<typeof loader>();

  return (
    <SharedLayout bottomNavShown={false} hasBackButton={true}>
      <ArticleDetail
        key={item.slug}
        slug={item.slug}
        publisher={{
          name: item.publishers.title,
          logoUrl: item.publishers.logo_url,
          slug: item.publishers.slug,
        }}
        authorName={item.author?.name}
        terms={item.terms}
        title={item.title}
        content={item.description}
        createdAt={item.created_at}
        readDuration={item.read_stats.minutes}
        detailUrl={`/artikel/${item.slug}`}
        imageUrl={item.image?.full?.url}
        sourceLink={item.link}
        metadata={item.metadata}
        link={item.link}
        gpt={item.gpt}
      />
    </SharedLayout>
  );
}
