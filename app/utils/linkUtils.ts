export function getArticleUrl({
  publisherSlug,
  articleSlug,
}: {
  publisherSlug: string;
  articleSlug: string;
}) {
  return `/${publisherSlug}/${articleSlug}`;
}
