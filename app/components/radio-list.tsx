import { useEffect, useRef, useState } from "react";
import { ModalEmbed } from "./modal-embed";
import type { TrackInfo } from "./radio-entity";
import { RadioItem, RadioItemLoading } from "./radio-item";
import { Link, useRevalidator } from "@remix-run/react";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { useToggleLike } from "~/hooks/useToggleLike";

export type RadioListProps = {
  items: TrackInfo[];
  favorite?: boolean;
  refreshInterval?: number;
  embed?: boolean;
  canBeSaved?: boolean;
};

export function RadioList(props: RadioListProps) {
  const { refreshInterval = 20000, canBeSaved } = props;
  const { revalidate } = useRevalidator();

  const [selectedTrack, setSelectedTrack] = useState<TrackInfo>();
  const half = Math.floor(props.items.length / 2);
  const [renderOnClient, setRenderOnClient] = useState(false);

  const { like, unlike, isLiked, isLoading, isDataLoaded } = useToggleLike({
    contentType: "radio",
  });

  const firstTime = useRef(true);

  useEffect(() => {
    if (refreshInterval) {
      let timer: NodeJS.Timer | undefined = undefined;

      const startLongPooling = () => {
        if (!firstTime.current) {
          revalidate();
        } else {
          firstTime.current = false;
        }
        timer = setInterval(() => {
          revalidate();
        }, refreshInterval);
      };
      const pauseLongPooling = () => {
        clearInterval(timer);
      };

      startLongPooling();

      window.addEventListener("focus", startLongPooling);
      window.addEventListener("blur", pauseLongPooling);
      return () => {
        clearInterval(timer);
        window.removeEventListener("focus", startLongPooling);
        window.removeEventListener("blur", pauseLongPooling);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reduce the item rendered on the server side.
  useEffect(() => {
    setRenderOnClient(true);
  }, []);

  if (props.favorite) {
    if (!isDataLoaded) {
      return <RadioListLoading count={4} />;
    }
  }

  const results = props.favorite
    ? props.items.filter((item) => isLiked(item.id))
    : props.items;

  return (
    <>
      {results.length > 0 ? (
        results.map((item, index) => {
          return (results.length > 10 && index < half) ||
            results.length < 10 ||
            renderOnClient ? (
            <RadioItem
              key={item.id}
              item={item}
              embed={props.embed}
              isLiked={isLiked(item.id)}
              onEmbedClick={() => setSelectedTrack(item)}
              toggleLikeLoading={isLoading(item.id)}
              onLikeClick={() => like(item.id)}
              onUnlikeClick={() => unlike(item.id)}
              canBeSaved={canBeSaved}
            />
          ) : null;
        })
      ) : (
        <RadioNotFound />
      )}

      <ModalEmbed track={selectedTrack} />
    </>
  );
}

export function RadioListLoading(props: { count: number }) {
  return (
    <>
      {[...Array(props.count)].map((_, index) => (
        <RadioItemLoading key={index} />
      ))}
    </>
  );
}

export function RadioNotFound() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center p-8 bg-base-200 gap-2">
      <HiOutlineDocumentSearch size={48} />
      Radio tidak ditemukan
      <Link to="/radio" className="btn btn-primary btn-sm">
        Cari Radio
      </Link>
    </div>
  );
}
