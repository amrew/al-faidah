import WPAPI from "wpapi";
import readingTime from "reading-time";
import { type LoaderArgs, json } from "@remix-run/node";
import { createServerSupabase } from "~/clients/createServerSupabase";
import MeiliSearch from "meilisearch";
import striptags from "striptags";
import {
  type ImageType,
  type ArticleType,
} from "~/components/article/article-entity";

export type Term = {
  id: string;
  name: string;
  slug: string;
  type: "category" | "tag";
};

const salafyTemanggungAuthorMap: Record<number, string> = {
  1: "Abu Nabil Al-Hasan",
  2: "Abu Ammar Ahmad",
  3: "Administrator",
  4: "Abu Abdillah Dendi",
  5: "Abu Hafshah Faozi",
  6: "Abu Ubay Afa",
  7: "Abu Nabil Al-Hasan",
};

export async function loader({ request }: LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id") || 0);
  const initialPage = Number(searchParams.get("initialPage") || 1);

  const { supabase, response } = createServerSupabase(
    request,
    process.env.SUPABASE_SECRET_KEY
  );

  const { data: publishers } = await supabase
    .from("publishers")
    .select("*")
    .eq("type_id", 1)
    .eq("status_id", 1)
    .neq("id", 7); // forbidden id

  const client = new MeiliSearch({
    host: process.env.MEILI_ENDPOINT!,
    apiKey: process.env.MEILI_MASTER_KEY!,
  });

  const errorLogs: string[] = [];

  if (!publishers) {
    return json(
      { message: "publishers not found" },
      { headers: response.headers }
    );
  }

  await Promise.all(
    publishers.map(async (publisher) => {
      const endpoint = publisher.web_url;
      const publisher_id = publisher.id;

      const wp = new WPAPI({ endpoint: `${endpoint}/wp-json` });

      const termMap: Record<string, Term> = {};
      const contents: Omit<ArticleType, "publishers">[] = [];

      const { data: last } = await supabase
        .from("contents")
        .select("created_at, updated_at")
        .eq("publisher_id", publisher_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!last) {
        errorLogs.push(`${publisher.title}: no last data found`);
        return;
      }

      const run = (page: number, perPage: number) => {
        return wp
          .posts()
          .embed()
          .perPage(perPage)
          .page(page)
          .param("after", last.created_at)
          .get()
          .then((data) => {
            for (const item of data) {
              const readStats = readingTime(item.content.rendered);
              let summary = striptags(item.excerpt.rendered);
              if (publisher.id == 14 && summary.length === 6) {
                summary = "";
              }
              const itemId = `${publisher_id}-${item.id}`;
              const content: Omit<ArticleType, "publishers"> = {
                id: itemId,
                created_at: item.date,
                updated_at: item.modified,
                link: item.link,
                slug: item.slug,
                title: item.title.rendered,
                description: item.content.rendered,
                summary: summary,
                status: item.status,
                read_stats: {
                  minutes: readStats.minutes,
                  time: readStats.time,
                  words: readStats.words,
                },
                image: null,
                category_id: null,
                publisher_id: publisher_id,
                user_id: publisher.owner_id,
                terms: [],
                type_id: 1,
                author: null,
                metadata: null,
                recommended: 0,
              };

              const metadata: Record<string, string> = {};

              const embedded = item["_embedded"]?.["wp:featuredmedia"]?.[0];
              const wpTerms = item["_embedded"]?.["wp:term"] || [];
              const author = item["_embedded"]?.["author"]?.[0];
              const media_details = embedded?.media_details;

              if (id === 9) {
                const acfProps =
                  item.acf && item.acf.hasOwnProperty("pertanyaan3")
                    ? item.acf
                    : null;

                if (acfProps) {
                  metadata.answer = item.content.rendered;
                  metadata.source = acfProps.sumber;
                  metadata.link = acfProps.link;
                  content.description = acfProps.pertanyaan3;
                }
              }

              if (author && id === 10) {
                content.author = {
                  id: author.id,
                  slug: author.slug,
                  name: salafyTemanggungAuthorMap[author.id],
                };
              } else if (author) {
                content.author = {
                  id: author.id,
                  slug: author.slug,
                  name: author.name,
                };
              }

              const image: ImageType | null = media_details?.sizes
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

              if (Object.keys(metadata).length > 0) {
                content.metadata = metadata;
              }

              contents.push(content);
            }
            return { contents, termMap };
          })
          .then(async ({ contents, termMap }) => {
            const taxonomies: Term[] = Object.values(termMap);
            const taxResult = await supabase
              .from("taxonomies")
              .upsert(taxonomies);
            const contentResult = await supabase
              .from("contents")
              .upsert(contents);

            const saveObjects = async () => {
              if (contents.length > 0) {
                const objects = [];

                for (let i = 0; i < contents.length; i++) {
                  const item = contents[i];
                  const { metadata } = item;
                  const description = metadata?.answer
                    ? `${item.description} ${metadata.answer}`
                    : item.description;

                  const content: Record<any, any> = {
                    id: item.id,
                    title: item.title,
                    slug: item.slug,
                    image: item.image,
                    created_at: item.created_at,
                    link: item.link,
                    read_stats: item.read_stats,
                    terms: item.terms,
                    publishers: {
                      title: publisher.title,
                      slug: publisher.slug,
                      logo_url: publisher.logo_url,
                      web_url: publisher.web_url,
                      status: publisher.status,
                    },
                    author: item.author,
                    summary: item.summary,
                    description: striptags(description),
                  };

                  if (metadata?.answer) {
                    content.answer = metadata?.answer;
                  }

                  objects.push(content);
                }
                try {
                  const res = await client
                    .index("contents")
                    .addDocuments(objects);
                  console.log(res);
                } catch (error) {
                  console.log(error);
                }
              }
            };

            await saveObjects();

            console.log("taxResult error", taxResult.error);
            console.log("contentResult error", contentResult.error);
            return { taxResult, contentResult };
          });
      };

      await wp
        .posts()
        .embed()
        .perPage(1)
        .page(1)
        .param("after", last.created_at)
        .get()
        .then(async (data) => {
          if (!data._paging) {
            errorLogs.push(`${publisher.title}: empty paging`);
            return;
          }

          const totalItem = data._paging.total;
          const totalPerItem = 10;
          const totalPage = Math.ceil(totalItem / totalPerItem);

          console.log("totalPage", totalPage);
          for (let page = initialPage; page <= totalPage; page++) {
            console.log("page", page);
            await run(page, totalPerItem);
          }
        });
    })
  );

  return json({ errorLogs }, { headers: response.headers });
}
