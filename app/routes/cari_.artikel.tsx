import { SharedLayout } from "~/components/shared-layout";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import type { ArticleType } from "~/components/article/article-entity";
import { BiLoader, BiSearch } from "react-icons/bi";
import { useDebounce } from "react-use";
import { useState } from "react";
import { TwoColumn } from "~/components/two-column";
import { Tab } from "~/components/tab";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { ArticleList } from "~/components/article/article-list";
import { useQuery } from "react-query";
import { appConfig } from "~/utils/appConfig";

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
    { title: `Pencarian artikel - ${appConfig.title}` },
    {
      name: "description",
      content: appConfig.metaDescription,
    },
  ];
};

const Hits = ({ hits }: { hits: Array<ArticleType> }) => (
  <ArticleList contents={hits} />
);

const SearchBox = ({
  keyword,
  onChange,
}: {
  keyword: string;
  onChange: (val: string) => void;
}) => {
  const [value, setValue] = useState(keyword);

  useDebounce(
    () => {
      if (value !== keyword) {
        onChange(value);
      }
    },
    300,
    [value]
  );

  return (
    <div className="flex-1 relative">
      <div className="absolute left-4 top-4">
        <BiSearch />
      </div>
      <input
        type="search"
        placeholder="Cari artikel..."
        className="input input-bordered pl-12 w-full md:w-2/3"
        value={value}
        onChange={(e) => {
          const value = e.currentTarget.value;
          setValue(value);
        }}
        autoFocus
      />
    </div>
  );
};

export default function Search() {
  const { keyword, normalizedKeyword } = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const q = keyword.replace(/ /g, "+");

  const query = useQuery(["search", q], () =>
    fetch(`/api/search/meili?q=${q}`).then((res) => res.json())
  );
  const { hits } = query.data || {};

  return (
    <SharedLayout
      hasBackButton={true}
      searchComponent={
        <SearchBox
          keyword={normalizedKeyword}
          onChange={(val) => {
            const q = val.replace(/ /g, "+");
            navigate(`/cari/artikel?q=${q}`);
          }}
        />
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
            <main>
              {hits && hits.length ? (
                <Hits hits={hits} />
              ) : query.isLoading ? (
                <BiLoader className="animate-spin" />
              ) : query.isSuccess && !hits?.length ? (
                <div>Artikel tidak ditemukan</div>
              ) : null}
            </main>
          </>
        }
        right={null}
      />
    </SharedLayout>
  );
}
