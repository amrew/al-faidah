import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import WPAPI from "wpapi";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import readingTime from "reading-time";
import { Configuration, OpenAIApi } from "openai";
import * as cheerio from "cheerio";

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

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
  };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";
  const page = Number(searchParams.get("page") || 1);

  const app = endpointMap[name];
  if (!app) {
    return NextResponse.json({ error: "no app provided" });
  }
  const endpoint = endpointMap[name].endpoint;
  const publisher_id = endpointMap[name].publisher_id;

  const supabase = createRouteHandlerClient({ cookies });

  const wp = new WPAPI({ endpoint: `${endpoint}/wp-json` });

  const termMap: Record<string, Term> = {};
  const contents: Content[] = [];

  return wp
    .posts()
    .embed()
    .perPage(5)
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
          user_id: "9ffac14d-d7d1-49fe-81ef-4ab6c86fab85",
          terms: [],
          embedding: null,
          type_id: 1,
        };

        const embedded = item["_embedded"]["wp:featuredmedia"][0];
        const wpTerms = item["_embedded"]["wp:term"];
        const media_details = embedded.media_details;

        const image: Image = {
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
        };
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

      // const contentsWithEmbedding = await Promise.all(
      //   contents.map((item) => {
      //     const getEmbedding = async () => {
      //       const embeddingResponse = await openai.createEmbedding({
      //         model: "text-embedding-ada-002",
      //         input: item.title,
      //       });

      //       const [{ embedding }] = embeddingResponse.data.data;
      //       return {
      //         ...item,
      //         embedding,
      //       };
      //     };
      //     return getEmbedding();
      //   })
      // );

      const contentResult = await supabase.from("contents").upsert(contents);

      return NextResponse.json({ taxResult, contentResult });
    });
}
