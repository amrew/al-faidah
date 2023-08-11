import { type LoaderArgs } from "@remix-run/node";
import {
  Configuration,
  OpenAIApi,
  type ChatCompletionRequestMessage,
} from "openai";
import { badRequest, eventStream } from "remix-utils";
import { processData } from "~/components/utils";

const systemMap: Record<string, ChatCompletionRequestMessage> = {
  title: {
    role: "system",
    content: `Beri 3 alternatif judul yang lebih bagus untuk SEO. Format HTML. <ul><li>judul 1</li><li>judul 2</li></ul>.`,
  },
  tag: {
    role: "system",
    content: `Beri 3 tag untuk artikel ini. Kebab case. Format JSON. ['tag1', 'tag2']`,
  },
  "meta-desc": {
    role: "system",
    content: `Buat isi meta description yang bagus untuk SEO dari artikel ini`,
  },
};

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const type = url.searchParams.get("type") || "";
  const description = url.searchParams.get("description") || "";

  if (!type || !description) {
    return badRequest("Missing parameters");
  }

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  );

  const systemMessage = systemMap[type];

  const messages = [
    systemMessage,
    {
      role: "user" as const,
      content: description,
    },
  ];

  const result = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0,
      max_tokens: 248,
      stream: true,
    },
    { responseType: "stream" }
  );

  let streamingDone = false;

  return eventStream(request.signal, function setup(send) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result.data.on("data", (data: string) => {
      const sendObj = async (params: Record<string, any>) => {
        if (!streamingDone) {
          send({ data: JSON.stringify(params) });
        }
      };

      processData(data, sendObj);
    });
    return function clear() {
      streamingDone = true;
    };
  });
};
