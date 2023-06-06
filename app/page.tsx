import Link from "next/link";
import { getTracks } from "~/components/radio-service";
import { AudioItem } from "~/components/audio-item";
import { ArticleItem } from "~/components/article-item";
import { SharedLayout } from "~/components/shared-layout";
import { Player } from "~/components/player";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Content } from "~/components/content";
import { RadioList } from "~/components/radio-list";

export default async function Home({
  searchParams: { page = 1 },
}: {
  searchParams: { page: number };
}) {
  const itemsPerPage = 5;
  const offset = (page - 1) * itemsPerPage + 1;
  const supabase = createServerComponentClient({ cookies });
  const [radios, { data: tags }, { data: contents }] = await Promise.all([
    getTracks({ sortBy: "most" }),
    supabase.from("tags").select().eq("type", "category"),
    supabase
      .from("contents")
      .select(
        "title, slug, summary, image, created_at, read_stats, tags( slug, name ), publishers( title, logo_url, web_url )"
      )
      .range(offset, itemsPerPage)
      .order("created_at", { ascending: false }),
  ]);
  const twoRadios = radios.slice(0, 2);
  return (
    <SharedLayout footer={<Player />}>
      <main className="flex flex-col p-4 sm:p-8 gap-6">
        <Content title="Kategori">
          <div className="carousel gap-2">
            {tags?.map((tag) => (
              <div className="carousel-item" key={tag.id}>
                <Link href="/">
                  <div className="bg-primary rounded-md h-16 w-24 sm:w-36 px-4 py-1">
                    <span className="text-white font-semibold">{tag.name}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </Content>
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex flex-col xl:w-5/12 gap-4">
            <Content title="Radio Populer">
              <div className="flex flex-col gap-4">
                <RadioList items={twoRadios} />
              </div>
            </Content>
            <Content title="Lanjut mendengarkan">
              <AudioItem
                title="Jeleknya Ambisi Kepemimpinan"
                speaker="Al-Ustadz Muhammad Afifuddin as-Sidawy"
                time="0:59"
                audioCount={1}
                detailUrl="https://www.ukhuwahanakkuliah.com/audio-islami/jeleknya-ambisi-kepemimpinan-7258"
              />
              <AudioItem
                title="Fikih Jenazah"
                speaker="Ustadz Hari Ahadi"
                audioCount={5}
                detailUrl="https://www.ukhuwahanakkuliah.com/audio-islami/audio-fikih/fikih-jenazah-7248"
              />
              <AudioItem
                title="Dosa-dosa Besar"
                speaker="Ustadz Hari Ahadi"
                audioCount={4}
                detailUrl="https://www.ukhuwahanakkuliah.com/audio-islami/dosa-dosa-besar-7245"
              />
            </Content>
          </div>
          <div className="flex flex-col xl:w-7/12 gap-4">
            <Content title="Artikel Terbaru">
              {contents?.map((item: any) => (
                <ArticleItem
                  key={item.slug}
                  author={{
                    name: item.publishers.title,
                    logoUrl: item.publishers.logo_url,
                  }}
                  category={{
                    name: item.tags.name,
                    categoryUrl: `/artikel/category/${item.tags.slug}`,
                  }}
                  title={item.title}
                  content={item.summary}
                  isFullContent={false}
                  createdAt={item.created_at}
                  readDuration={item.read_stats.minutes}
                  detailUrl={`/artikel/${item.slug}`}
                  imageUrl={item.image?.medium?.url || item.image?.small?.url}
                />
              ))}
            </Content>
          </div>
        </div>
        {/* // */}
      </main>
    </SharedLayout>
  );
}
