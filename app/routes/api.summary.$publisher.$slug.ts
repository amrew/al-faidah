import { type LoaderArgs } from "@remix-run/node";
import { createServerSupabase } from "~/clients/createServerSupabase";
import type { ArticleDetailType } from "~/components/article-entity";
import { Configuration, OpenAIApi } from "openai";
import { badRequest, eventStream } from "remix-utils";
import striptags from "striptags";

const processData = function (
  data: { toString: () => string },
  sendObj: (params: Record<string, any>) => void
) {
  const lines = data
    .toString()
    .split("\n")
    .filter((line: string) => line.trim() !== "");

  for (const line of lines) {
    const message = line.toString().replace(/^data: /, "");
    if (message === "[DONE]") {
      sendObj({
        text: "",
        finish: true,
      });
      return;
    }
    try {
      const parsed = JSON.parse(message);
      if (parsed.error) {
        sendObj({
          text: "",
          finishReason: parsed.error.message,
        });
      } else {
        const finishReason = parsed.choices[0].finish_reason;
        const delta = parsed.choices[0].delta?.content;
        if (delta) {
          sendObj({
            text: delta,
            finishReason,
          });
        }
      }
    } catch (error) {
      console.error("Could not JSON parse stream message", message, error);
    }
  }
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const slug = params.slug;
  const publisherSlug = params.publisher;

  const { supabase, response } = createServerSupabase(
    request,
    process.env.SUPABASE_SECRET_KEY
  );

  const [{ data: item }] = await Promise.all([
    supabase
      .from("contents")
      .select<any, ArticleDetailType>(
        `id, description, metadata, publishers!inner( slug )`
      )
      .eq("slug", slug)
      .eq("publishers.slug", publisherSlug)
      .single(),
  ]);

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  );

  const description = item?.metadata?.answer
    ? `Pertanyaan: ${item.description}\n\nJawaban: ${item.metadata.answer}`
    : item?.description;

  if (!description) {
    return badRequest("Missing description");
  }

  const messages = [
    {
      role: "system" as const,
      content: `Buat rangkuman dari artikel, ambil point-pointnya maksimal 5 kalimat dengan kalimat yang singkat tapi jelas. Format HTML. <ul><li>point 1</li><li>point 2</li></ul>`,
    },
    {
      role: "user" as const,
      content: striptags(description),
    },
  ];

  const result = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0,
      max_tokens: 2000,
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
            const metadata = {
              ...(item.metadata || {}),
              gpt: {
                summary,
                createdAt: new Date().toISOString(),
              },
            };

            await supabase
              .from("contents")
              .update({ metadata })
              .eq("id", item.id);
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
