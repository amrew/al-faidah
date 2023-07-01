import { useNavigate } from "@remix-run/react";
import { useSupabase, useUser } from "./useSupabase";
import { useMutation, useQuery } from "react-query";

type Params = {
  contentType: "article" | "radio";
  onLikeCallback?: () => void;
  onUnlikeCallback?: () => void;
};

export function useToggleLike({
  contentType,
  onLikeCallback,
  onUnlikeCallback,
}: Params) {
  const supabase = useSupabase();
  const user = useUser();
  const navigate = useNavigate();
  const messageType = `${contentType}-like`;

  const getContentLikes = async () => {
    if (user) {
      return await supabase
        .from("content_likes")
        .select()
        .eq("type", contentType)
        .eq("user_id", user.id);
    }
    return undefined;
  };

  const likeArticle = async (id: string) => {
    if (user) {
      const result = await supabase
        .from("content_likes")
        .insert({ type: contentType, content_id: id });
      if (result.error) {
        throw result.error;
      }
    } else {
      navigate(`/auth/login?messageType=${messageType}`);
    }
  };

  const unlikeArticle = async (id: string) => {
    if (user) {
      const result = await supabase
        .from("content_likes")
        .delete()
        .eq("type", contentType)
        .eq("content_id", id)
        .eq("user_id", user.id);
      if (result.error) {
        throw result.error;
      }
    } else {
      navigate(`/auth/login?messageType=${messageType}`);
    }
  };

  const {
    data: contentLikes,
    isSuccess,
    refetch,
  } = useQuery(["contentLikes"], getContentLikes, {
    enabled: !!user,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const contentLikesMap = contentLikes?.data?.reduce((acc, contentLike) => {
    return { ...acc, [contentLike.content_id]: true };
  }, {});

  const likeMutation = useMutation(likeArticle, {
    onSuccess: () => {
      refetch();
      onLikeCallback?.();
    },
  });

  const unlikeMutation = useMutation(unlikeArticle, {
    onSuccess: () => {
      refetch();
      onUnlikeCallback?.();
    },
  });

  return {
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    isLiked: (id: string) => {
      return contentLikesMap?.[id];
    },
    isLoading: (id: string) =>
      (likeMutation.isLoading && likeMutation.variables === id) ||
      (unlikeMutation.isLoading && unlikeMutation.variables === id),
    isDataLoaded: isSuccess,
  };
}
