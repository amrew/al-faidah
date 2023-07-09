import { SharedLayout } from "~/components/shared-layout";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  connectHits,
  connectSearchBox,
} from "react-instantsearch-dom";
import { json, type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import type { ArticleSummaryType } from "~/components/article-entity";
import { BiSearch } from "react-icons/bi";
import { useDebounce } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TwoColumn } from "~/components/two-column";
import { Tab } from "~/components/tab";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { ArticleList } from "~/components/article-list";

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

const Hits = ({ hits }: { hits: Array<ArticleSummaryType> }) => (
  <ArticleList contents={hits} />
);

const CustomHits = connectHits(Hits);

const SearchBox = ({
  keyword,
  onChange,
  refine,
}: {
  keyword: string;
  onChange: (val: string) => void;
  isSearchStalled: boolean;
  refine: (value: string) => void;
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

  useEffect(() => {
    refine(keyword);
  }, [keyword]);

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

const CustomSearchBox = connectSearchBox(SearchBox);

export default function Search() {
  const { keyword, normalizedKeyword } = useLoaderData<typeof loader>();
  const { env } = useOutletContext<{
    env: {
      ALGOLIA_APP_ID: string;
      ALGOLIA_API_KEY: string;
    };
  }>();
  const searchClient = useRef(
    algoliasearch(env.ALGOLIA_APP_ID, env.ALGOLIA_API_KEY)
  );

  const navigate = useNavigate();
  const q = keyword.replace(/ /g, "+");

  return (
    <InstantSearch searchClient={searchClient.current} indexName="contents">
      <SharedLayout
        searchComponent={
          <CustomSearchBox
            defaultRefinement={normalizedKeyword}
            keyword={normalizedKeyword}
            onChange={(val) => {
              const q = val.replace(/ /g, "+");
              navigate(`/cari/artikel?q=${q}`);
            }}
          />
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
                      id: "topik",
                      title: "Topik",
                      href: `/cari/topik?q=${q}`,
                    },
                  ]}
                />
              </div>
              <main>
                <CustomHits />
              </main>
            </>
          }
          right={null}
        />
      </SharedLayout>
    </InstantSearch>
  );
}
