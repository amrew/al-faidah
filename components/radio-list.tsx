"use client";

import { useState } from "react";
import { ModalEmbed } from "./modal-embed";
import type { TrackInfo } from "./radio-entity";
import { RadioItem } from "./radio-item";

export type RadioListProps = {
  items: TrackInfo[];
};

export function RadioList(props: RadioListProps) {
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo>();
  return (
    <>
      {props.items?.map((item) => (
        <RadioItem
          key={item.id}
          item={item}
          onEmbedClick={() => setSelectedTrack(item)}
        />
      ))}
      <ModalEmbed track={selectedTrack} />
    </>
  );
}
