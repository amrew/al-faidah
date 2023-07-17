type ImageProps = {
  url: string;
  width: number;
  height: number;
};

export type ImageType = {
  full: ImageProps | null;
  medium: ImageProps | null;
  small: ImageProps | null;
};

export type ArticleSummaryType = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: ImageType | null;
  created_at: string;
  read_stats: {
    minutes: number;
  };
  taxonomies: {
    slug: string;
    name: string;
  };
  publishers: {
    title: string;
    logo_url: string;
    web_url: string;
    slug: string;
  };
  author: {
    slug: string;
    name: string;
  } | null;
  link: string;
  metadata?: {
    answer?: string;
    source?: string;
    link?: string;
    gpt?: {
      summary: string;
      createdAt: string;
    };
  } | null;
};

export type ArticleDetailType = {
  description: string;
  link: string;
} & Omit<ArticleSummaryType, "summary">;
