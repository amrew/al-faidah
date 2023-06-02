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
      <h1 className="text-lg font-bold line-clamp-2">{props.title}</h1>
      <p
        className={`text-gray-500 ${
          !props.isFullContent ? "line-clamp-3" : ""
        }`}
      >
        {props.content}
      </p>
    </>
  );
  return (
    <div className="bg-base-100 rounded-md border border-base-300 p-4">
      <div className="flex flex-row gap-1 mb-1">
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
            <Link href={props.detailUrl}>{titleDescription}</Link>
          ) : (
            <div>{titleDescription}</div>
          )}
          <div className="flex flex-row gap-2 mt-1 items-center">
            <span className="text-gray-600 text-sm">{props.createdAt}</span>
            <BiCircle size={6} className="text-gray-600" />
            <span className="text-gray-600 text-sm">
              baca {props.readDuration} menit
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
          <div>
            <img
              src={props.imageUrl}
              alt={props.title}
              className="w-48 h-36 object-cover"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
