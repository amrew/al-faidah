import Link from "next/link";
import { supabase } from "~/clients/supabaseClient";
import type { PropsWithChildren } from "react";
import { cache } from "react";
import { getTracks } from "~/components/radio-service";
import { RadioItem } from "~/components/radio-item";
import { AudioItem } from "~/components/audio-item";
import { ArticleItem } from "~/components/article-item";
import { SharedLayout } from "~/components/shared-layout";
import { Player } from "~/components/player";

const getTags = cache(async () => {
  return await supabase.from("tags").select();
});

function Content(props: PropsWithChildren<{ title: string }>) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{props.title}</h1>
      {props.children}
    </div>
  );
}

export default async function Home() {
  const [radios, { data: tags }] = await Promise.all([
    getTracks({ sortBy: "most" }),
    getTags(),
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
                {twoRadios.map((item) => (
                  <RadioItem
                    key={item.id}
                    item={{
                      id: item.id,
                      serial: item.serial,
                      logoUrl: item.logoUrl,
                      name: item.name,
                      trackTitle: item.trackTitle,
                      listenerCount: item.listenerCount,
                      status: item.status,
                      trackUrl: item.trackUrl,
                    }}
                  />
                ))}
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
              <ArticleItem
                author={{
                  name: "syababsalafy.com",
                  logoUrl:
                    "https://syababsalafy.com/wp-content/uploads/2022/12/cropped-Desain-tanpa-judul-32x32.png",
                }}
                category={{
                  name: "Santri",
                  categoryUrl: "/artikel/category/1",
                }}
                title="3 Trik Jitu Agar Kamu Menjadi Juara Kelas"
                content="Ujian semester di pondok pesantren adalah momen yang sangat berharga. Pada momen ini, para santri akan diuji sejauh mana pemahaman yang berhasil diporoleh selama satu semster penuh."
                isFullContent={false}
                createdAt="30 Mei"
                readDuration={2}
                detailUrl="https://syababsalafy.com/3-trik-jitu-agar-kamu-menjadi-juara-kelas.html"
                imageUrl="https://syababsalafy.com/wp-content/uploads/2022/09/juara-1.jpg"
              />
              <ArticleItem
                author={{
                  name: "problematikaumat.com",
                  logoUrl:
                    "https://problematikaumat.com/wp-content/uploads/2018/11/favicon.png",
                }}
                category={{
                  name: "Tanya Jawab",
                  categoryUrl: "/artikel/category/2",
                }}
                title="Bekerja Di Madinah Atau Berdakwah di Kampung?"
                content="Manakah yang lebih afdhol bagi seorang yang memiliki ilmu, bekerja di Madinah sehingga bisa shalat di masjid Nabawi atau tinggal di kampung untuk mendakwahkan al Quran dan Assunnah."
                isFullContent={false}
                createdAt="29 Mei"
                readDuration={3}
                detailUrl="https://problematikaumat.com/bekerja-di-madinah-atau-berdakwah-di-kampung"
                imageUrl="https://problematikaumat.com/wp-content/uploads/2023/04/IMG-20230429-WA0007-750x375.jpg"
              />
              <ArticleItem
                author={{
                  name: "atsar.id",
                  logoUrl: "https://www.atsar.id/favicon.ico",
                }}
                category={{
                  name: "Adab-Akhlak",
                  categoryUrl: "/artikel/category/3",
                }}
                title="Ujub Menghancurkan Amalan"
                content="Jika Allah membukakan untukmu pintu shalat malam, janganlah engkau melihat orang-orang yang tidur dengan pandangan merendahkan!"
                isFullContent={false}
                createdAt="28 Mei"
                readDuration={3}
                detailUrl="https://www.atsar.id/2015/11/ujub-menghancurkan-amalan.html"
                imageUrl="https://1.bp.blogspot.com/-1ux0yNKsdVQ/VkmWouOiiiI/AAAAAAAAFJs/CxdqFaoQjuo/s1600/ujub%2Bmenghancurkan%2Bamalan.jpg"
              />
            </Content>
          </div>
        </div>
        {/* // */}
      </main>
    </SharedLayout>
  );
}
