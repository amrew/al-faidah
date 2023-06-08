"use client";

import { useContext, useEffect, useState } from "react";
import { ModalEmbed } from "./modal-embed";
import type { TrackInfo } from "./radio-entity";
import { RadioItem, RadioItemLoading } from "./radio-item";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useMutation, useQuery } from "react-query";
import { UserContext } from "./user-context";
import { useRouter } from "next/navigation";

export type RadioListProps = {
  items: TrackInfo[];
  favorite?: boolean;
};

export function RadioList(props: RadioListProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [selectedTrack, setSelectedTrack] = useState<TrackInfo>();
  const half = Math.floor(props.items.length / 2);
  const [renderOnClient, setRenderOnClient] = useState(false);

  const { user } = useContext(UserContext);

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
      router.push("/auth/login?messageType=like");
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
      router.push("/auth/login?messageType=like");
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
      {results?.map((item, index) => {
        return (results.length > 10 && index < half) ||
          results.length < 10 ||
          renderOnClient ? (
          <RadioItem
            key={item.id}
            item={item}
            isLiked={!!radioLikesMap?.[item.id]}
            onEmbedClick={() => setSelectedTrack(item)}
            toggleLikeLoading={
              (likeMutation.isLoading && likeMutation.variables === item.id) ||
              (unlikeMutation.isLoading && unlikeMutation.variables === item.id)
            }
            onLikeClick={() => likeMutation.mutate(item.id)}
            onUnlikeClick={() => unlikeMutation.mutate(item.id)}
          />
        ) : null;
      })}
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
