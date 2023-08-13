import { json, redirect, type LoaderArgs } from "@remix-run/node";
import { createServerSupabase } from "~/clients/createServerSupabase";
import type { ArticleType } from "~/components/article-entity";
import { MeiliSearch } from "meilisearch";
import striptags from "striptags";

export async function loader({ request }: LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const initialPage = Number(searchParams.get("initialPage") || 1);

  const client = new MeiliSearch({
    host: process.env.MEILI_ENDPOINT!,
    apiKey: process.env.MEILI_MASTER_KEY!,
  });

  const { supabase, response } = createServerSupabase(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || (user && user.id !== process.env.USER_ID)) {
    return json({ error: "auth failed" });
  }

  const { count: totalItem } = await supabase
    .from("contents")
    .select("*, publishers!inner( status ) ", { count: "exact", head: true })
    .eq("publishers.status", "active");

  console.log("totalItem", totalItem);

  if (totalItem) {
    const perPage = 250;
    const totalPage = Math.ceil(totalItem / perPage);

    console.log("totalPage", totalPage);

    for (let page = initialPage; page <= totalPage; page++) {
      const offset = (page - 1) * perPage;
      const to = offset + perPage - 1;

      console.log("page", page, "offset", offset, "to", to);

      const { data } = await supabase
        .from("contents")
        .select<any, ArticleType>(
          `id, title, slug, summary, description, image, created_at, link, 
          read_stats, terms, publishers!inner( title, slug, logo_url, web_url, status ), 
          author, metadata`
        )
        .range(offset, to)
        .eq("publishers.status", "active")
        .order("publisher_id", { ascending: true });

      const saveObjects = async () => {
        if (data) {
          const objects = [];

          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const { metadata, ...rest } = item;
            const description = metadata?.answer
              ? `${item.description} ${metadata.answer}`
              : item.description;

            const content: Record<any, any> = {
              ...rest,
              id: `${item.publishers.slug}-${item.slug}`,
              summary: striptags(item.summary),
              description: striptags(description),
            };

            if (metadata?.answer) {
              content.answer = metadata?.answer;
            }

            objects.push(content);
          }
          try {
            const res = await client.index("contents").addDocuments(objects);
            console.log(res);
          } catch (error) {
            console.log(error);
          }
        }
      };

      await saveObjects();

      await client
        .index("contents")
        .updateSearchableAttributes(["title", "description"]);

      if (page % 5 === 0) {
        // return json({ ok: true }, { headers: response.headers });
        return redirect(`/api/meili?initialPage=${page + 1}`, {
          headers: response.headers,
        });
      }
    }
  }

  return json({ ok: true }, { headers: response.headers });
}
