import { SharedLayout } from "~/components/shared-layout";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { type ChangeEvent } from "react";
import { TwoColumn } from "~/components/two-column";
import { Tab } from "~/components/tab";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { debounce } from "debounce";
import { BiSearch } from "react-icons/bi";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("q") || "";
  const normalizedKeyword = keyword.replace("+", " ");

  return json({
    keyword,
    normalizedKeyword,
  });
};

export const meta: V2_MetaFunction = ({ data }) => {
  return [
    { title: `Pencarian artikel - Al Faidah` },
    {
      name: "description",
      content:
        "Media dakwah Ahlus Sunnah Wal Jama'ah yang berisi bermacam-macam artikel, kajian, radio dan audio islami",
    },
  ];
};

export default function Search() {
  const { keyword, normalizedKeyword } = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const q = keyword.replace(/ /g, "+");

  return (
    <SharedLayout
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
                navigate(`/cari/artikel?q=${normalizedValue}`, {
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
        left={
          <>
            <h1 className="text-xl md:text-3xl mt-2 mb-4">
              Hasil pencarian <strong>{normalizedKeyword}</strong>
            </h1>
            <div className="sticky top-0 right-0 mb-4 pt-2 pb-2 bg-base-100">
              <Tab
                currentId="artikel"
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
          </>
        }
        right={null}
      />
    </SharedLayout>
  );
}
