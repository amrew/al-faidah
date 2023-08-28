import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { Pagination } from "~/components/pagination";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { SharedLayout } from "~/components/shared-layout";
import { TwoColumn } from "~/components/two-column";
import { Tab } from "~/components/tab";
import { debounce } from "debounce";
import { BiSearch } from "react-icons/bi";
import type { ChangeEvent } from "react";
import { appConfig } from "~/utils/appConfig";

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("q") || "";
  const page = Number(url.searchParams.get("page") || 1);
  const type = "publisher";

  const { supabase, response } = createServerSupabase(request);

  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  const normalizedKeyword = keyword.replace("+", " ");
  const searchParams = keyword.split("+").reduce((acc, cur) => {
    if (acc === "") return `'${cur}'`;
    return `${acc} | '${cur}'`;
  }, "");

  const [{ data: publishers }, { count }] = await Promise.all([
    supabase
      .from("publishers")
      .select<
        any,
        {
          id: string;
          slug: string;
          title: string;
          logo_url: string;
          web_url: string;
          description: string;
        }
      >("id, slug, title, logo_url, web_url, description")
      .textSearch("title", `${searchParams}`)
      .eq("status_id", 1)
      .range(offset, offset + itemsPerPage - 1)
      .order("created_at", { ascending: false }),
    supabase
      .from("publishers")
      .select("id", { count: "exact", head: true })
      .textSearch("title", `${searchParams}`)
      .eq("status_id", 1),
  ]);

  const totalPage = count ? Math.ceil(count / itemsPerPage) : 0;

  return json(
    {
      type,
      publishers,
      page,
      totalPage,
      keyword,
      normalizedKeyword,
    },
    { headers: response.headers }
  );
};

export const meta: V2_MetaFunction = ({ data }) => {
  const { normalizedKeyword } = data;
  return [
    { title: `Pencarian '${normalizedKeyword}' - ${appConfig.title}` },
    {
      name: "description",
      content: appConfig.metaDescription,
    },
  ];
};

export default function Articles() {
  const { type, publishers, page, totalPage, keyword, normalizedKeyword } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const q = keyword.replace(/ /g, "+");

  return (
    <SharedLayout
      hasBackButton={true}
      searchComponent={
        <div className="flex-1 relative">
          <div className="absolute left-4 top-4">
            <BiSearch />
          </div>
          <input
            type="search"
            placeholder="Cari artikel..."
            className="input input-bordered pl-12 w-full md:w-2/3"
            defaultValue={normalizedKeyword}
            onChange={debounce<(e: ChangeEvent<HTMLInputElement>) => void>(
              (e) => {
                const value = e.target.value;
                const normalizedValue = value.replace(" ", "+");
                navigate(`/cari/${type}?q=${normalizedValue}`, {
                  replace: true,
                });
              },
              500
            )}
            autoFocus
          />
        </div>
      }
    >
      <TwoColumn
        reversed
        left={
          <>
            <h1 className="text-xl md:text-3xl mt-2 mb-4">
              Hasil pencarian <strong>{normalizedKeyword}</strong>
            </h1>
            <div className="sticky top-0 right-0 mb-4 pt-2 pb-2 bg-base-100">
              <Tab
                currentId={type}
                items={[
                  {
                    id: "artikel",
                    title: "Artikel",
                    href: `/cari/artikel?q=${q}`,
                  },
                  {
                    id: "publisher",
                    title: "Publisher",
                    href: `/cari/publisher?q=${q}`,
                  },
                  {
                    id: "tag",
                    title: "Tag",
                    href: `/cari/tag?q=${q}`,
                  },
                ]}
              />
            </div>
            <main className="flex flex-col gap-4">
              {publishers && publishers?.length > 0 ? (
                publishers?.map((publisher) => (
                  <Link
                    to={`/publisher/${publisher.slug}`}
                    key={publisher.id}
                    className="flex flex-row gap-4 items-center"
                  >
                    <div className="avatar">
                      <div className="w-12 rounded-full bg-base-200 p-2">
                        <img
                          loading="lazy"
                          src={publisher.logo_url}
                          alt={publisher.title}
                          width={48}
                          height={48}
                          className="avatar"
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{publisher.title}</h2>
                      <p>{publisher.description}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div>
                  <p>Pastikan kata pencarian tidak salah ketik</p>
                  <p>Coba kata lain</p>
                  <p>Coba kata yang lebih umum</p>
                </div>
              )}
            </main>
            <Pagination
              page={page}
              totalPage={totalPage}
              buildUrl={(page) => {
                let params: Record<string, string> = {};
                if (keyword) {
                  params.q = keyword;
                }
                if (page) {
                  params.page = String(page);
                }
                const searchParams = new URLSearchParams(params);
                return `/cari/${type}?${searchParams.toString()}`;
              }}
            />
          </>
        }
        right={null}
      />
    </SharedLayout>
  );
}
