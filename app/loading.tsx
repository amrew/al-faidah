import {
  ArticleItemLoading,
  ArticleItemSmallLoading,
} from "~/components/article-item";
import { SharedLayout } from "~/components/shared-layout";
import { PublisherTabLoading } from "~/components/publisher-tab";

export default async function RootLoading() {
  return (
    <SharedLayout>
      <main className="flex flex-col md:flex-row-reverse justify-end p-4 md:px-8 gap-4 lg:gap-16">
        <div className="w-full md:w-5/12 lg:w-4/12">
          <div className="flex flex-col gap-4 sticky top-0 py-4">
            <div>
              <h2 className="font-bold text-lg">Pilihan Editor</h2>
              <div className="mt-2">
                <div className="flex flex-col gap-2">
                  {[...Array(2)]?.map((_, idx) => (
                    <ArticleItemSmallLoading key={idx} />
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
                {[...Array(4)].map((_, idx) => (
                  <button key={idx} className="btn btn-sm w-24 h-8"></button>
                ))}
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
            <PublisherTabLoading />
          </div>
          {[...Array(4)]?.map((_, idx) => (
            <ArticleItemLoading key={idx} />
          ))}
        </div>
      </main>
    </SharedLayout>
  );
}
