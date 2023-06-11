import type { PropsWithChildren } from "react";
import { RefreshButton } from "~/components/refresh-button";
import { SharedLayout } from "~/components/shared-layout";

export default function ArticleLayout(props: PropsWithChildren) {
  return (
    <SharedLayout
      footer={
        <div className="relative">
          <RefreshButton />
        </div>
      }
    >
      {props.children}
    </SharedLayout>
  );
}
