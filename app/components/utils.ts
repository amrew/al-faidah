import { useState } from "react";
import type { SortBy, TrackInfo } from "./radio-entity";

export const APP_URL = "https://al-faidah.com";

export const QUOTA_CREATION = 2;

export type ThemeName =
  | "light"
  | "cupcake"
  | "pastel"
  | "corporate"
  | "lofi"
  | "dracula"
  | "autumn";

export const themes: { name: ThemeName; color: string }[] = [
  { name: "light", color: "bg-gray-300" },
  { name: "cupcake", color: "bg-teal-400" },
  { name: "pastel", color: "bg-purple-200" },
  { name: "corporate", color: "bg-blue-500" },
  { name: "lofi", color: "bg-black" },
  { name: "dracula", color: "bg-slate-600" },
  { name: "autumn", color: "bg-red-700" },
];

export const sortRadios = (radios: TrackInfo[], sortBy: SortBy | undefined) => {
  if (sortBy === "live") {
    return [...radios].sort((a, b) =>
      a.status.toLowerCase() === "live" && b.status.toLowerCase() !== "live"
        ? -1
        : 1
    );
  } else if (sortBy === "most") {
    return [...radios].sort((a, b) =>
      a.listenerCount > b.listenerCount ? -1 : 1
    );
  } else if (sortBy === "less") {
    return [...radios].sort((a, b) =>
      a.listenerCount < b.listenerCount ? -1 : 1
    );
  } else {
    return radios;
  }
};

export const processData = function (
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

type ResultState = {
  type: "idle" | "fetching" | "done" | "error";
  value: string;
};

export const useCompletion = (
  params: {
    url?: string;
    result?: string;
  } = {}
) => {
  const [state, setState] = useState<ResultState>({
    type: "idle",
    value: "",
  });

  const fetch = (query: Record<string, any>) => {
    if (params.result) {
      setState({
        type: "done",
        value: params.result,
      });
      return;
    }

    const searchParams = new URLSearchParams(query);
    const sse = new EventSource(
      `${params.url || "/api/completion"}?${searchParams.toString()}`
    );

    setState({
      type: "fetching",
      value: "",
    });

    sse.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.finish) {
          setState((prev) => {
            return {
              type: "done",
              value: prev.value + data.text,
            };
          });
          sse.close();
        } else {
          setState((prev) => {
            return {
              type: "fetching",
              value: prev.value + data.text,
            };
          });
        }
      } catch (e) {}
    });

    sse.addEventListener("error", (err) => {
      console.log("error: ", err);
      setState((prev) => ({
        ...prev,
        type: "error",
      }));
      sse.close();
    });

    sse.addEventListener("end", (event) => {
      setState((prev) => ({
        ...prev,
        type: "done",
      }));
      sse.close();
    });
  };

  return { fetch, state };
};
