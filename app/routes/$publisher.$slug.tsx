import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ArticleDetailType } from "~/components/article-entity";
import { ArticleDetail } from "~/components/article-item";
import { BackButton } from "~/components/back-button";
import { type V2_MetaFunction } from "@remix-run/node";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { SharedLayout } from "~/components/shared-layout";

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug;
  const publisherSlug = params.publisher;

  const { supabase, response } = createServerSupabase(request);

  const [{ data: item }] = await Promise.all([
    supabase
      .from("contents")
      .select<any, ArticleDetailType>(
        `id, title, slug, summary, description, link, image, created_at, 
        read_stats, taxonomies( slug, name ), publishers!inner( title, logo_url, web_url ),
        author, metadata`
      )
      .eq("id", slug)
      .eq("publishers.slug", publisherSlug)
      .single(),
  ]);

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
    { title: `${item.title} - Al Faidah` },
    {
      name: "description",
      content: item.summary,
    },
    {
      name: "robots",
      content: "noindex",
    },
  ];
};

export default function Detail() {
  const { item } = useLoaderData<typeof loader>();
  return (
    <SharedLayout>
      <div className="flex flex-row items-center px-4 pt-4 md:px-8">
        <BackButton />
      </div>
      <div className="flex flex-row gap-4 p-4 md:px-8">
        <div>
          {item ? (
            <ArticleDetail
              key={item.slug}
              publisher={{
                name: item.publishers.title,
                logoUrl: item.publishers.logo_url,
              }}
              authorName={item.author?.name}
              category={{
                name: item.taxonomies.name,
                categoryUrl: `/artikel/category/${item.taxonomies.slug}`,
              }}
              title={item.title}
              content={item.description}
              createdAt={item.created_at}
              readDuration={item.read_stats.minutes}
              detailUrl={`/artikel/${item.slug}`}
              imageUrl={item.image?.full?.url}
              sourceLink={item.link}
              metadata={item.metadata}
              link={item.link}
            />
          ) : null}
        </div>
      </div>
    </SharedLayout>
  );
}
