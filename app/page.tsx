import { ArticleItem, ArticleItemSmall } from "~/components/article-item";
import { SharedLayout } from "~/components/shared-layout";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { ArticleSummaryType } from "~/components/article-entity";
import { PublisherTab } from "~/components/publisher-tab";

export default async function Home({
  searchParams: { page = 1, publisher },
}: {
  searchParams: { page: number; publisher: string };
}) {
  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage + 1;
  const supabase = createServerComponentClient({ cookies });

  const getContents = () => {
    let query = supabase.from("contents").select<any, ArticleSummaryType>(
      `id, title, slug, summary, image, created_at, 
      read_stats, taxonomies( slug, name ), publishers!inner( title, slug, logo_url, web_url )`
    );

    if (publisher) {
      query = query.eq("publishers.slug", publisher);
    }

    return query
      .range(offset, itemsPerPage)
      .order("created_at", { ascending: false });
  };

  const getEditorPicks = () => {
    return supabase
      .from("contents")
      .select<any, ArticleSummaryType>(
        `id, title, slug, read_stats, taxonomies( slug, name ), publishers!inner( title, slug, logo_url )`
      )
      .eq("recommended", 1)
      .range(0, 2)
      .order("created_at", { ascending: false });
  };

  const getPublishers = () => {
    return supabase.from("publishers").select("id, title, slug, logo_url");
  };

  const [{ data: contents }, { data: editorPicks }, { data: publishers }] =
    await Promise.all([getContents(), getEditorPicks(), getPublishers()]);

  return (
    <SharedLayout>
      <main className="flex flex-col md:flex-row-reverse justify-end p-4 md:px-8 gap-4 lg:gap-16">
        <div className="w-full md:w-5/12 lg:w-4/12">
          <div className="flex flex-col gap-4 sticky top-0 py-4">
            <div>
              <h2 className="font-bold text-lg">Pilihan Editor</h2>
              <div className="mt-2">
                <div className="flex flex-col gap-2">
                  {editorPicks?.map((item) => (
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
                  ))}
                </div>
                <a href="" className="text-primary">
                  Lihat semua
                </a>
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
                <a href="" className="text-primary">
                  Lihat semua topik
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-7/12 lg:w-8/12">
          <div className="sticky top-0 right-0 mb-4 pt-2 pb-2 bg-base-100">
            <PublisherTab
              currentPublisher={publisher}
              publishers={
                publishers?.map((item) => ({
                  slug: item.slug,
                  title: item.title,
                })) || []
              }
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
        </div>
      </main>
    </SharedLayout>
  );
}
