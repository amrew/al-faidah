import { useState } from "react";

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
