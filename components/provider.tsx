"use client";

import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "./user-context";

const queryClient = new QueryClient();

export function Provider(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>{props.children}</UserProvider>
    </QueryClientProvider>
  );
}
