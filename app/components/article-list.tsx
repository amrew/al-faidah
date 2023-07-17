import { getArticleUrl } from "~/utils/linkUtils";
import type { ArticleSummaryType } from "./article-entity";
import { ArticleItem } from "./article-item";
import { useToggleLike } from "~/hooks/useToggleLike";

export type ArticleListProps = {
  contents: ArticleSummaryType[];
  onLikeCallback?: () => void;
  onUnlikeCallback?: () => void;
};

export function ArticleList({
  contents,
  onLikeCallback,
  onUnlikeCallback,
}: ArticleListProps) {
  const { like, unlike, isLiked, isLoading } = useToggleLike({
    contentType: "article",
    onLikeCallback,
    onUnlikeCallback,
  });

  return contents?.map((item) => (
    <ArticleItem
      key={item.id}
      slug={item.slug}
      title={item.title}
      content={item.summary}
      createdAt={item.created_at}
      readDuration={item.read_stats.minutes}
      category={{
        name: item.taxonomies.name,
        categoryUrl: `/kategori/${item.taxonomies.slug}`,
      }}
      publisher={{
        name: item.publishers.title,
        logoUrl: item.publishers.logo_url,
        slug: item.publishers.slug,
      }}
      authorName={item.author?.name}
      detailUrl={getArticleUrl({
        publisherSlug: item.publishers.slug,
        articleSlug: item.slug,
      })}
      link={item.link}
      imageUrl={item.image?.small?.url}
      toggleLikeLoading={isLoading(item.id)}
      onLikeClick={() => like(item.id)}
      onUnlikeClick={() => unlike(item.id)}
      isLiked={isLiked(item.id)}
    />
  ));
}
