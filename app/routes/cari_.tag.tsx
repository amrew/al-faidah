import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { SharedLayout } from "~/components/shared-layout";
import { TwoColumn } from "~/components/two-column";
import { Tab } from "~/components/tab";
import { BiSearch } from "react-icons/bi";
import type { ChangeEvent } from "react";
import debounce from "debounce";
import { appConfig } from "~/utils/appConfig";

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("q") || "";
  const type = "tag";

  const { supabase, response } = createServerSupabase(request);

  const normalizedKeyword = keyword.replace("+", " ");
  const searchParams = keyword.split("+").reduce((acc, cur) => {
    if (acc === "") return `'${cur}'`;
    return `${acc} | '${cur}'`;
  }, "");

  const [{ data: taxonomies }] = await Promise.all([
    supabase
      .from("taxonomies")
      .select<
        any,
        {
          id: string;
          slug: string;
          name: string;
        }
      >("id, slug, name")
      .textSearch("name", `${searchParams}`)
      .order("created_at", { ascending: false }),
  ]);

  return json(
    {
      type,
      taxonomies,
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
  const { type, taxonomies, keyword, normalizedKeyword } =
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
            <main>
              {taxonomies && taxonomies.length > 0 ? (
                <div className="flex flex-row flex-wrap gap-2">
                  {taxonomies.map((item) => (
                    <Link
                      to={`/tag/${item.slug}`}
                      key={item.id}
                      className="btn btn-sm"
                    >
                      {item.slug}
                    </Link>
                  ))}
                </div>
              ) : (
                <div>
                  <p>Pastikan kata pencarian tidak salah ketik</p>
                  <p>Coba kata lain</p>
                  <p>Coba kata yang lebih umum</p>
                </div>
              )}
            </main>
          </>
        }
        right={null}
      />
    </SharedLayout>
  );
}
