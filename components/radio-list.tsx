"use client";

import { useEffect, useState } from "react";
import { ModalEmbed } from "./modal-embed";
import type { TrackInfo } from "./radio-entity";
import { RadioItem } from "./radio-item";

export type RadioListProps = {
  items: TrackInfo[];
};

export function RadioList(props: RadioListProps) {
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo>();
  const half = Math.floor(props.items.length / 2);
  const [renderOnClient, setRenderOnClient] = useState(false);

  // reduce the item rendered on the server side.
  useEffect(() => {
    setRenderOnClient(true);
  }, []);

  return (
    <>
      {props.items?.map((item, index) =>
        index < half || renderOnClient ? (
          <RadioItem
            key={item.id}
            item={item}
            onEmbedClick={() => setSelectedTrack(item)}
          />
        ) : null
      )}
      <ModalEmbed track={selectedTrack} />
    </>
  );
}
