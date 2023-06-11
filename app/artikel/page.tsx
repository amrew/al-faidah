import { ArticleItem } from "~/components/article-item";
import { SharedLayout } from "~/components/shared-layout";
import { Player } from "~/components/player";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { ArticleSummaryType } from "~/components/article-entity";

export default async function Articles({
  searchParams: { page = 1 },
}: {
  searchParams: { page: number };
}) {
  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage + 1;
  const supabase = createServerComponentClient({ cookies });
  const [{ data: contents }] = await Promise.all([
    supabase
      .from("contents")
      .select<any, ArticleSummaryType>(
        "id, title, slug, summary, image, created_at, read_stats, taxonomies( slug, name ), publishers( title, logo_url, web_url )"
      )
      .range(offset, itemsPerPage)
      .order("created_at", { ascending: false }),
  ]);
  return (
    <main className="flex flex-col p-4 md:p-8 gap-4">
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
    </main>
  );
}
