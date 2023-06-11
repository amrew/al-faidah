import type { PropsWithChildren } from "react";
import { Player } from "~/components/player";
import { RefreshButton } from "~/components/refresh-button";
import { SharedLayout } from "~/components/shared-layout";

export default function ArticleLayout(props: PropsWithChildren) {
  return (
    <SharedLayout
      footer={
        <div>
          <div className="relative">
            <RefreshButton />
          </div>
          <Player />
        </div>
      }
    >
      {props.children}
    </SharedLayout>
  );
}
