import { type LoaderArgs } from "@remix-run/node";
import { createServerSupabase } from "~/clients/createServerSupabase";
import type { ArticleType } from "~/components/article/article-entity";
import { Configuration, OpenAIApi } from "openai";
import { badRequest, eventStream } from "remix-utils";
import striptags from "striptags";
import { processData } from "~/utils/streamUtils";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const slug = url.searchParams.get("slug") || "";
  const publisherSlug = url.searchParams.get("publisher") || "";

  if (!slug || !publisherSlug) {
    return badRequest("Missing parameters");
  }

  const { supabase, response } = createServerSupabase(
    request,
    process.env.SUPABASE_SECRET_KEY
  );

  const [{ data: item }] = await Promise.all([
    supabase
      .from("contents")
      .select<any, ArticleType>(
        `id, description, gpt, publishers!inner( slug, status_id )`
      )
      .eq("slug", slug)
      .eq("status_id", 1)
      .eq("publishers.slug", publisherSlug)
      .eq("publishers.status_id", 1)
      .single(),
  ]);

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  );

  const description = item?.metadata?.answer
    ? item.metadata.answer
    : item?.description;

  if (!description) {
    return badRequest("Missing description");
  }

  const messages = [
    {
      role: "system" as const,
      content: `Can you provide a comprehensive summary of the given text? The summary should cover all the key points, while also condensing the information into a concise and easy-to-understand format. The length of the summary should be short, but providing a clear and accurate overview without omitting any important information. If the content is an image, tell me that you can't read it (in Indonesian). The result should be in pure HTML format. No markdown needed. Example: <div><ul><li>point 1</li><li>point 2</li></ul></div>`,
    },
    {
      role: "user" as const,
      content: striptags(description, {
        allowedTags: new Set(["img"]),
      }),
    },
  ];

  const result = await openai.createChatCompletion(
    {
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0,
      max_tokens: 2048,
      stream: true,
    },
    { responseType: "stream" }
  );

  let summary = "";
  let streamingDone = false;

  return eventStream(
    request.signal,
    function setup(send) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      result.data.on("data", (data: string) => {
        const sendObj = async (params: Record<string, any>) => {
          summary += params.text;

          if (item && params.finish) {
            const gpt = {
              ...item.gpt,
              summary,
              createdAt: new Date().toISOString(),
            };

            await supabase.from("contents").update({ gpt }).eq("id", item.id);
          }

          if (!streamingDone) {
            send({ data: JSON.stringify(params) });
          }
        };

        processData(data, sendObj);
      });
      return function clear() {
        streamingDone = true;
      };
    },
    { headers: response.headers }
  );
};
