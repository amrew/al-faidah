import { getTracks } from "~/components/radio-service";
import { ArticleItem } from "~/components/article-item";
import { SharedLayout } from "~/components/shared-layout";
import { Player } from "~/components/player";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Content } from "~/components/content";
import { RadioList } from "~/components/radio-list";
import type { ArticleSummaryType } from "~/components/article-entity";

export default async function Home({
  searchParams: { page = 1 },
}: {
  searchParams: { page: number };
}) {
  const itemsPerPage = 5;
  const offset = (page - 1) * itemsPerPage + 1;
  const supabase = createServerComponentClient({ cookies });
  const [radios, { data: contents }] = await Promise.all([
    getTracks({ sortBy: "most" }),
    supabase
      .from("contents")
      .select<any, ArticleSummaryType>(
        "id, title, slug, summary, image, created_at, read_stats, taxonomies( slug, name ), publishers( title, logo_url, web_url )"
      )
      .range(offset, itemsPerPage)
      .order("created_at", { ascending: false }),
  ]);
  const twoRadios = radios.slice(0, 2);
  return (
    <SharedLayout footer={<Player />}>
      <div className="container mx-auto">
        <main className="flex flex-col md:flex-row-reverse p-4 gap-4">
          <Content title="Radio" className="flex-1">
            <div className="flex flex-col gap-4">
              <RadioList items={twoRadios} />
            </div>
          </Content>
          <Content title="Terbaru" className="max-w-2xl">
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
          </Content>
        </main>
      </div>
    </SharedLayout>
  );
}
