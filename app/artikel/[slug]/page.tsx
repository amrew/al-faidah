import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { ArticleDetailType } from "~/components/article-entity";
import { ArticleDetail } from "~/components/article-item";

export default async function Home({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  const [{ data: item }] = await Promise.all([
    supabase
      .from("contents")
      .select<any, ArticleDetailType>(
        "title, slug, description, link, image, created_at, read_stats, taxonomies( slug, name ), publishers( title, logo_url, web_url )"
      )
      .eq("id", slug)
      .single(),
  ]);

  return (
    <div className="flex flex-row gap-6 p-4 md:p-8">
      <div>
        {item ? (
          <ArticleDetail
            key={item.slug}
            author={{
              name: item.publishers.title,
              logoUrl: item.publishers.logo_url,
            }}
            category={{
              name: item.taxonomies.name,
              categoryUrl: `/artikel/category/${item.taxonomies.slug}`,
            }}
            title={item.title}
            content={item.description}
            createdAt={item.created_at}
            readDuration={item.read_stats.minutes}
            detailUrl={`/artikel/${item.slug}`}
            imageUrl={item.image?.medium?.url}
            sourceLink={item.link}
          />
        ) : null}
      </div>
    </div>
  );
}
