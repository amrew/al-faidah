import WPAPI from "wpapi";
import readingTime from "reading-time";
import { type LoaderArgs, json } from "@remix-run/node";
import { createServerSupabase } from "~/clients/createServerSupabase";

type Term = {
  id: string;
  name: string;
  slug: string;
  type: "category" | "tag";
};

type Image = {
  full: { url: string; width: number; height: number } | null;
  medium: { url: string; width: number; height: number } | null;
  small: { url: string; width: number; height: number } | null;
} | null;

type Content = {
  id: string;
  created_at: string;
  updated_at: string;
  original_id: string;
  link: string;
  slug: string;
  title: string;
  description: string;
  read_stats: { minutes: number; time: number; words: number };
  summary: string;
  status: string;
  image: Image;
  category_id: string | null;
  publisher_id: number;
  user_id: string;
  terms: string[];
  embedding: string | null;
  type_id: number;
};

const endpointMap: Record<string, { endpoint: string; publisher_id: number }> =
  {
    ss: {
      endpoint: "https://syababsalafy.com",
      publisher_id: 1,
    },
    uak: {
      endpoint: "https://www.ukhuwahanakkuliah.com",
      publisher_id: 2,
    },
    asy: {
      endpoint: "https://asysyariah.com",
      publisher_id: 3,
    },
    prob: {
      endpoint: "https://problematikaumat.com",
      publisher_id: 4,
    },
    tash: {
      endpoint: "https://tashfiyah.com",
      publisher_id: 5,
    },
    qonitah: {
      endpoint: "https://qonitah.id",
      publisher_id: 6,
    },
    warisan: {
      endpoint: "https://warisansalaf.com",
      publisher_id: 7,
    },
  };

export async function loader({ request }: LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";
  const initialPage = Number(searchParams.get("initialPage") || 1);

  const app = endpointMap[name];
  if (!app) {
    return json({ error: "no app provided" });
  }

  const endpoint = endpointMap[name].endpoint;
  const publisher_id = endpointMap[name].publisher_id;

  const { supabase, response } = createServerSupabase(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || (user && user.id !== process.env.USER_ID)) {
    return json({ error: "auth failed" });
  }

  const wp = new WPAPI({ endpoint: `${endpoint}/wp-json` });

  const termMap: Record<string, Term> = {};
  const contents: Content[] = [];

  const run = (page: number, perPage: number) => {
    return wp
      .posts()
      .embed()
      .perPage(perPage)
      .page(page)
      .get()
      .then((data) => {
        for (const item of data) {
          const readStats = readingTime(item.content.rendered);
          const content: Content = {
            id: item.slug,
            created_at: item.date,
            updated_at: item.modified,
            original_id: item.id,
            link: item.link,
            slug: item.slug,
            title: item.title.rendered,
            description: item.content.rendered,
            summary: item.excerpt.rendered,
            status: item.status,
            read_stats: {
              minutes: readStats.minutes,
              time: readStats.time,
              words: readStats.words,
            },
            image: null,
            category_id: null,
            publisher_id: publisher_id,
            user_id: process.env.USER_ID!,
            terms: [],
            embedding: null,
            type_id: 1,
          };

          const embedded = item["_embedded"]?.["wp:featuredmedia"]?.[0];
          const wpTerms = item["_embedded"]["wp:term"];
          const media_details = embedded?.media_details;

          const image: Image | null = media_details
            ? {
                full: media_details.sizes.full
                  ? {
                      url: media_details.sizes.full?.source_url,
                      width: media_details.sizes.full?.width,
                      height: media_details.sizes.full?.height,
                    }
                  : null,
                medium: media_details.sizes.large
                  ? {
                      url: media_details.sizes.large?.source_url,
                      width: media_details.sizes.large?.width,
                      height: media_details.sizes.large?.height,
                    }
                  : null,
                small: media_details.sizes.medium
                  ? {
                      url: media_details.sizes.medium?.source_url,
                      width: media_details.sizes.medium?.width,
                      height: media_details.sizes.medium?.height,
                    }
                  : null,
              }
            : null;

          content.image = image;

          const terms: string[] = [];
          for (const termsdeep of wpTerms) {
            for (const term of termsdeep) {
              termMap[term.slug] = {
                id: term.slug,
                name: term.name,
                slug: term.slug,
                type: term.taxonomy === "category" ? "category" : "tag",
              };
              if (!content.category_id && term.taxonomy === "category") {
                content.category_id = term.slug;
              }
              terms.push(term.slug);
            }
          }
          content.terms = terms;

          contents.push(content);
        }
        return { contents, termMap };
      })
      .then(async ({ contents, termMap }) => {
        const taxonomies: Term[] = Object.values(termMap);
        const taxResult = await supabase.from("taxonomies").upsert(taxonomies);
        const contentResult = await supabase.from("contents").upsert(contents);
        return { taxResult, contentResult };
      });
  };

  return wp
    .posts()
    .embed()
    .perPage(1)
    .page(1)
    .get()
    .then(async (data) => {
      const totalItem = data._paging.total;
      const totalPerItem = 10;
      const totalPage = Math.ceil(totalItem / totalPerItem);

      console.log("totalPage", totalPage);
      for (let page = initialPage; page <= totalPage; page++) {
        console.log("page", page);
        await run(page, totalPerItem);
      }

      return json({ data }, { headers: response.headers });
    });
}
