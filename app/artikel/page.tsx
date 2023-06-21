import { ArticleItem } from "~/components/article-item";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { ArticleSummaryType } from "~/components/article-entity";
import Link from "next/link";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export default async function Articles({
  searchParams,
}: {
  searchParams: { page: number };
}) {
  const itemsPerPage = 10;
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * itemsPerPage + 1;

  const supabase = createServerComponentClient({ cookies });
  const [{ data: contents }, { count }] = await Promise.all([
    supabase
      .from("contents")
      .select<any, ArticleSummaryType>(
        "id, title, slug, summary, image, created_at, read_stats, taxonomies( slug, name ), publishers( title, logo_url, web_url )"
      )
      .range(offset, offset + itemsPerPage - 1)
      .order("created_at", { ascending: false }),
    supabase.from("contents").select("id", { count: "exact", head: true }),
  ]);
  const totalPage = count ? Math.ceil(count / itemsPerPage) : 0;
  const hasMorePage = totalPage > page;
  const isFirstPage = page === 1;

  return (
    <>
      <main className="p-4 md:p-8 gap-4 grid grid-cols-1 md:grid-cols-2">
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
      <div className="flex justify-center mb-4 sm:mb-8">
        <div className="join">
          {!isFirstPage ? (
            <>
              <Link href={`/artikel?page=${page - 1}`}>
                <button className="join-item btn" disabled={isFirstPage}>
                  <BiChevronLeft size={22} />
                </button>
              </Link>
              <Link href={`/artikel?page=${page - 1}`}>
                <button className="join-item btn">{page - 1}</button>
              </Link>
            </>
          ) : null}
          <button className="join-item btn btn-active btn-primary">
            {page}
          </button>
          {page + 1 <= totalPage ? (
            <>
              <Link href={`/artikel?page=${page + 1}`}>
                <button className="join-item btn" disabled={!hasMorePage}>
                  {page + 1}
                </button>
              </Link>
              <Link href={`/artikel?page=${page + 1}`}>
                <button className="join-item btn" disabled={!hasMorePage}>
                  <BiChevronRight size={22} />
                </button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
