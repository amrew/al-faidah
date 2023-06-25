import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AudioProvider } from "./audio-context";

const queryClient = new QueryClient();

export function Provider(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioProvider>{props.children}</AudioProvider>
    </QueryClientProvider>
  );
}
