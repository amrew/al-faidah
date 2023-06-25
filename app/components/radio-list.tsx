import { useEffect, useRef, useState } from "react";
import { ModalEmbed } from "./modal-embed";
import type { TrackInfo } from "./radio-entity";
import { RadioItem, RadioItemLoading } from "./radio-item";
import { useMutation, useQuery } from "react-query";
import { useSupabase, useUser } from "~/clients/useSupabase";
import { Link, useNavigate, useRevalidator } from "@remix-run/react";
import { HiOutlineDocumentSearch } from "react-icons/hi";

export type RadioListProps = {
  items: TrackInfo[];
  favorite?: boolean;
  refreshInterval?: number;
  embed?: boolean;
};

export function RadioList(props: RadioListProps) {
  const { refreshInterval = 20000 } = props;
  const supabase = useSupabase();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const [selectedTrack, setSelectedTrack] = useState<TrackInfo>();
  const half = Math.floor(props.items.length / 2);
  const [renderOnClient, setRenderOnClient] = useState(false);

  const user = useUser();

  const getRadioLikes = async () => {
    if (user) {
      return await supabase
        .from("radio_likes")
        .select()
        .eq("type", "radio")
        .eq("user_id", user.id);
    }
    return undefined;
  };

  const likeRadio = async (id: string) => {
    if (user) {
      const result = await supabase
        .from("radio_likes")
        .insert({ type: "radio", content_id: id });
      if (result.error) {
        throw result.error;
      }
    } else {
      navigate("/auth/login?messageType=like");
    }
  };

  const unlikeRadio = async (id: string) => {
    if (user) {
      const result = await supabase
        .from("radio_likes")
        .delete()
        .eq("type", "radio")
        .eq("content_id", id)
        .eq("user_id", user.id);
      if (result.error) {
        throw result.error;
      }
    } else {
      navigate("/auth/login?messageType=like");
    }
  };

  const { data: radioLikes, refetch } = useQuery(
    ["radioLikes"],
    getRadioLikes,
    {
      enabled: !!user,
      cacheTime: Infinity,
    }
  );
  const radioLikesMap = radioLikes?.data?.reduce((acc, radioLike) => {
    return { ...acc, [radioLike.content_id]: true };
  }, {});

  const likeMutation = useMutation(likeRadio, {
    onSuccess: () => {
      refetch();
    },
  });

  const unlikeMutation = useMutation(unlikeRadio, {
    onSuccess: () => {
      refetch();
    },
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
    if (!radioLikesMap) {
      return <RadioListLoading count={4} />;
    }
  }

  const results = props.favorite
    ? props.items.filter((item) => !!radioLikesMap?.[item.id])
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
              isLiked={!!radioLikesMap?.[item.id]}
              onEmbedClick={() => setSelectedTrack(item)}
              toggleLikeLoading={
                (likeMutation.isLoading &&
                  likeMutation.variables === item.id) ||
                (unlikeMutation.isLoading &&
                  unlikeMutation.variables === item.id)
              }
              onLikeClick={() => likeMutation.mutate(item.id)}
              onUnlikeClick={() => unlikeMutation.mutate(item.id)}
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
