import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { createServerSupabase } from "~/clients/createServerSupabase";
import { SharedLayout } from "~/components/shared-layout";
import { TwoColumn } from "~/components/two-column";
import { Tab } from "~/components/tab";

export const loader = async ({ request, params }: LoaderArgs) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("q") || "";
  const type = "topik";

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
    { title: `Pencarian '${normalizedKeyword}' - Al Faidah` },
    {
      name: "description",
      content:
        "Media dakwah Ahlus Sunnah Wal Jama'ah yang berisi bermacam-macam artikel, kajian, radio dan audio islami",
    },
  ];
};

export default function Articles() {
  const { type, taxonomies, keyword, normalizedKeyword } =
    useLoaderData<typeof loader>();

  return (
    <SharedLayout
      keyword={normalizedKeyword}
      searchHref={(value) => `/cari/topik?q=${value}`}
    >
      <TwoColumn
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
                    href: `/cari/artikel?q=${keyword}`,
                  },
                  {
                    id: "publisher",
                    title: "Publisher",
                    href: `/cari/publisher?q=${keyword}`,
                  },
                  {
                    id: "topik",
                    title: "Topik",
                    href: `/cari/topik?q=${keyword}`,
                  },
                ]}
              />
            </div>
            <div></div>
            {taxonomies && taxonomies.length > 0 ? (
              <div className="flex flex-row flex-wrap gap-2">
                {taxonomies.map((item) => (
                  <Link
                    to={`/topik/${item.slug}`}
                    key={item.id}
                    className="btn btn-sm"
                  >
                    {item.name}
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
          </>
        }
        right={null}
      />
    </SharedLayout>
  );
}
