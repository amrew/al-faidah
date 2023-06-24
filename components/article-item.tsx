import dayjs from "dayjs";
import Link from "next/link";
import { BiCircle } from "react-icons/bi";

export type ArticleItemProps = {
  title: string;
  content: string;
  isFullContent: boolean;
  createdAt: string;
  readDuration: number;
  imageUrl?: string;
  category: {
    name: string;
    categoryUrl: string;
  };
  author: {
    name: string;
    logoUrl: string;
  };
  detailUrl: string;
};

export function ArticleItem(props: ArticleItemProps) {
  const titleDescription = (
    <>
      <h1
        className="text-xl md:text-2xl font-bold line-clamp-2"
        dangerouslySetInnerHTML={{ __html: props.title }}
      />
      <div
        className={`prose ${!props.isFullContent ? "line-clamp-3" : ""}`}
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
    </>
  );
  const createdAt = dayjs(props.createdAt).format("DD MMM YYYY");
  return (
    <div className="border-b border-b-base-300 mb-8 pb-8">
      <div className="flex flex-row gap-1 mb-2">
        <img
          src={props.author.logoUrl}
          alt={props.author.name}
          width={16}
          height={16}
        />
        <span className="text-sm">{props.author.name}</span>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col flex-1 justify-between">
          {!props.isFullContent ? (
            <Link
              href={props.detailUrl}
              prefetch={false}
              className="gap-1 flex flex-col"
            >
              {titleDescription}
            </Link>
          ) : (
            <div className="gap-1 flex flex-col">{titleDescription}</div>
          )}
          <div className="flex flex-row gap-2 mt-1 items-center">
            <span className="text-gray-600 text-sm">{createdAt}</span>
            <BiCircle size={6} className="text-gray-600" />
            <span className="text-gray-600 text-sm">
              baca {Math.ceil(props.readDuration)} menit
            </span>
            <BiCircle size={6} className="text-gray-600 hidden sm:block" />
            <Link href={props.category.categoryUrl} className="hidden sm:block">
              <span className="badge badge-secondary line-clamp-1 text-white">
                {props.category.name}
              </span>
            </Link>
          </div>
        </div>
        {props.imageUrl ? (
          <img
            src={props.imageUrl}
            alt={props.title}
            className="w-24 h-16 self-center sm:w-48 sm:h-36 object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}

export function ArticleItemSmall(
  props: Omit<
    ArticleItemProps,
    "content" | "isFullContent" | "createdAt" | "sourceLink"
  >
) {
  return (
    <div className="border-b border-b-base-300 mb-2 pb-2">
      <div className="flex flex-row gap-1 mb-2">
        <img
          src={props.author.logoUrl}
          alt={props.author.name}
          width={16}
          height={16}
          className="object-contain"
        />
        <span className="text-sm">{props.author.name}</span>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col flex-1 justify-between">
          <Link
            href={props.detailUrl}
            prefetch={false}
            className="gap-1 flex flex-col"
          >
            <h1
              className="text-md font-bold line-clamp-2"
              dangerouslySetInnerHTML={{ __html: props.title }}
            />
          </Link>
          <div className="flex flex-row gap-2 mt-1 items-center">
            <span className="text-gray-600 text-sm">
              baca {Math.ceil(props.readDuration)} menit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleDetail(
  props: { sourceLink: string } & Omit<ArticleItemProps, "isFullContent">
) {
  const createdAt = dayjs(props.createdAt).format("DD MMM YYYY");
  return (
    <div className="p-4 lg:p-10">
      <div className="flex flex-row gap-2 mb-2">
        <img
          src={props.author.logoUrl}
          alt={props.author.name}
          width={24}
          height={24}
        />
        <span className="text-md">{props.author.name}</span>
      </div>
      <div className="flex flex-row gap-4 mt-4">
        <div className="flex flex-col flex-1 justify-between gap-8">
          <div className="gap-4 flex flex-col">
            <h1
              className="text-xl md:text-4xl font-bold"
              dangerouslySetInnerHTML={{ __html: props.title }}
            />
            <div className="flex flex-row gap-2 mt-1 items-center">
              <span className="text-gray-600 text-sm">{createdAt}</span>
              <BiCircle size={6} className="text-gray-600" />
              <span className="text-gray-600 text-sm">
                baca {Math.ceil(props.readDuration)} menit
              </span>
              <BiCircle size={6} className="text-gray-600 hidden sm:block" />
              <Link
                href={props.category.categoryUrl}
                className="hidden sm:block"
              >
                <span className="badge badge-secondary line-clamp-1 text-white">
                  {props.category.name}
                </span>
              </Link>
            </div>
            {props.imageUrl ? (
              <div>
                <img
                  src={props.imageUrl}
                  alt={props.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            ) : null}
            <div
              className={"prose prose-pre:whitespace-pre-wrap"}
              dangerouslySetInnerHTML={{ __html: props.content }}
            />
          </div>
          {props.sourceLink ? (
            <div className="alert alert-warning">
              <div>Sumber Tulisan:</div>
              <a href={props.sourceLink} target="_blank">
                {props.sourceLink}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
