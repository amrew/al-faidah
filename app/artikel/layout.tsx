import type { PropsWithChildren } from "react";
import { Player } from "~/components/player";
import { RefreshButton } from "~/components/refresh-button";
import { SharedLayout } from "~/components/shared-layout";

export default function RadioLayout(props: PropsWithChildren) {
  return (
    <SharedLayout
      footer={
        <div>
          <div className="relative">
            <RefreshButton refreshInterval={10000} />
          </div>
          <Player />
        </div>
      }
    >
      {props.children}
    </SharedLayout>
  );
}
