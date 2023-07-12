import dayjs from "dayjs";
import { Link } from "@remix-run/react";
import { BiChevronDown, BiChevronUp, BiCircle, BiLoader } from "react-icons/bi";
import { FaShare } from "react-icons/fa";
import { TbBookmarkPlus } from "react-icons/tb";
import { BsBookmarkFill, BsShare } from "react-icons/bs";
import { RWebShare } from "react-web-share";
import * as cheerio from "cheerio";
import { useMemo, useState } from "react";
import { AudioList } from "./audio-list";

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
  publisher: {
    name: string;
    logoUrl: string;
  };
  authorName?: string;
  detailUrl: string;
  metadata?: {
    answer?: string;
    source?: string;
    link?: string;
  } | null;
  link: string;
  toggleLikeLoading?: boolean;
  onLikeClick?: () => void;
  onUnlikeClick?: () => void;
  isLiked?: boolean;
};

export function ArticleItem(props: ArticleItemProps) {
  const titleDescription = (
    <>
      <h1
        className="text-xl md:text-2xl font-bold line-clamp-2 capitalize"
        dangerouslySetInnerHTML={{ __html: props.title.toLowerCase() }}
      />
      <div
        className={`prose ${!props.isFullContent ? "line-clamp-3" : ""}`}
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
    </>
  );
  const createdAt = dayjs(props.createdAt).format("DD MMM YYYY");

  const wrapWithLink = (node: React.ReactNode) => {
    if (!props.isFullContent) {
      return <Link to={props.detailUrl}>{node}</Link>;
    } else {
      return node;
    }
  };

  return (
    <div className="border-b border-b-base-300 mb-8 pb-8">
      <div className="flex flex-row gap-1 mb-2 items-center">
        <img
          src={props.publisher.logoUrl}
          alt={props.publisher.name}
          width={16}
          height={16}
          className="object-contain"
        />
        <div className="line-clamp-1">
          <span className="text-sm font-semibold">{props.publisher.name} </span>
          {props.authorName ? (
            <>
              <span className="text-sm">oleh </span>
              <span className="text-sm font-semibold">{props.authorName}</span>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col flex-1 justify-between">
          {wrapWithLink(
            <div className="gap-1 flex flex-col">{titleDescription}</div>
          )}
          <div className="flex flex-row gap-2 mt-1 items-center">
            <span className="text-gray-600 text-sm">{createdAt}</span>
            <BiCircle size={6} className="text-gray-600" />
            <span className="text-gray-600 text-sm">
              baca {Math.ceil(props.readDuration)} menit
            </span>
            <BiCircle size={6} className="text-gray-600 hidden sm:block" />
            <Link to={props.category.categoryUrl} className="hidden sm:block">
              <span className="badge badge-secondary line-clamp-1 text-white">
                {props.category.name}
              </span>
            </Link>
          </div>
        </div>
        {props.imageUrl
          ? wrapWithLink(
              <img
                src={props.imageUrl}
                alt={props.title}
                className="w-24 h-16 self-center sm:w-48 sm:h-36 object-cover"
              />
            )
          : null}
      </div>
      <div className="mt-4 flex flex-row gap-2">
        <RWebShare
          data={{
            title: props.title,
            text: props.content,
            url: props.link,
          }}
          sites={["whatsapp", "telegram", "mail", "copy"]}
        >
          <button className={`btn btn-outline btn-sm btn-circle`}>
            <BsShare />
          </button>
        </RWebShare>
        {!props.toggleLikeLoading ? (
          <button
            className={`btn btn-sm ${
              props.isLiked ? "btn-accent" : "btn-outline"
            }`}
            onClick={props.isLiked ? props.onUnlikeClick : props.onLikeClick}
          >
            {props.isLiked ? (
              <BsBookmarkFill className="text-white" />
            ) : (
              <TbBookmarkPlus />
            )}
          </button>
        ) : (
          <button className={`btn btn-ghost btn-sm`}>
            <BiLoader />
          </button>
        )}
        <Link
          to={props.link}
          target="_blank"
          className="btn btn-primary btn-sm text-white"
        >
          Sumber <FaShare />
        </Link>
      </div>
    </div>
  );
}

export function ArticleItemLoading() {
  const titleDescription = (
    <>
      <div>
        <div className="w-full h-7 bg-base-300 animate-pulse mb-2 " />
        <div className="w-1/3 h-7 bg-base-300 animate-pulse " />
      </div>
      <div>
        <div className={"bg-base-300 animate-pulse w-full h-5 mt-2"} />
        <div className={"bg-base-300 animate-pulse w-full h-5 mt-2"} />
        <div className={"bg-base-300 animate-pulse w-1/2 h-5 mt-2"} />
      </div>
    </>
  );
  return (
    <div className="border-b border-b-base-300 mb-8 pb-8">
      <div className="flex flex-row gap-1 mb-2 items-center">
        <div className="w-4 h-4 bg-base-300 animate-pulse" />
        <span className="text-sm bg-base-300 animate-pulse w-24 h-5" />
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col flex-1 justify-between">
          <div className="gap-1 flex flex-col">{titleDescription}</div>
          <div className="flex flex-row gap-2 mt-1 items-center">
            <span className="w-24 h-4 bg-base-300 animate-pulse" />
            <BiCircle size={6} className="text-gray-600" />
            <span className="w-24 h-4 bg-base-300 animate-pulse" />
            <BiCircle size={6} className="text-gray-600 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="badge badge-secondary line-clamp-1 text-white w-24"></span>
            </div>
          </div>
        </div>
        <div className="w-24 h-16 self-center sm:w-48 sm:h-36 bg-base-300 animate-pulse" />
      </div>
      <div className="mt-4 flex flex-row gap-2">
        <button className="btn btn-outline btn-sm">
          <TbBookmarkPlus />
        </button>
        <button className="btn btn-accent btn-sm">
          Sumber <FaShare />
        </button>
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
      <div className="flex flex-row gap-1 mb-2 items-center">
        <img
          src={props.publisher.logoUrl}
          alt={props.publisher.name}
          width={16}
          height={16}
          className="object-contain"
        />
        <div className="line-clamp-1">
          <span className="text-sm">{props.publisher.name}</span>
          {props.authorName ? (
            <>
              <span className="text-sm">oleh </span>
              <span className="text-sm font-semibold">{props.authorName}</span>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col flex-1 justify-between">
          <Link to={props.detailUrl} className="gap-1 flex flex-col">
            <h1
              className="text-md font-bold line-clamp-2 capitalize"
              dangerouslySetInnerHTML={{ __html: props.title.toLowerCase() }}
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

export function ArticleItemSmallLoading() {
  return (
    <div className="border-b border-b-base-300 mb-2 pb-2">
      <div className="flex flex-row gap-1 mb-2 items-center">
        <div className="w-4 h-4 bg-base-300 animate-pulse" />
        <span className="text-sm bg-base-300 animate-pulse w-24 h-5" />
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <div className="text-md font-bold w-full h-5 bg-base-300 animate-pulse mb-1" />
            <div className="text-md font-bold w-1/2 h-5 bg-base-300 animate-pulse" />
          </div>
          <div className="flex flex-row gap-2 mt-1 items-center">
            <span className="text-sm bg-base-300 animate-pulse w-24 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleAudios() {}

export function ArticleDetail(
  props: { sourceLink: string } & Omit<ArticleItemProps, "isFullContent">
) {
  const [descShown, setDescVisibility] = useState(false);
  const createdAt = dayjs(props.createdAt).format("DD MMM YYYY");
  const description = props.metadata?.answer ? (
    <div>
      <h2 className="text-xl font-bold mb-2">Pertanyaan</h2>
      <div className="p-4 bg-base-200 rounded-md max-w-2xl">
        <div
          className={"prose lg:prose-lg prose-pre:whitespace-pre-wrap"}
          dangerouslySetInnerHTML={{ __html: props.content }}
        />
      </div>
      <h2 className="text-xl font-bold mt-4 mb-2">Jawaban</h2>
      <div
        className={"prose lg:prose-lg prose-pre:whitespace-pre-wrap"}
        dangerouslySetInnerHTML={{ __html: props.metadata.answer }}
      />
    </div>
  ) : (
    <div
      className={"prose lg:prose-lg prose-pre:whitespace-pre-wrap"}
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  );

  const imageNode = props.imageUrl ? (
    <img
      src={props.imageUrl}
      alt={props.title}
      className="w-full h-auto object-contain rounded-md"
    />
  ) : null;

  const hasAudio = props.content.includes("<audio");
  const $ = cheerio.load(props.content);

  const audios = useMemo(() => {
    if (hasAudio) {
      const items = $("audio source").map((i, el) => {
        return $(el);
      });
      return items
        ?.map((i, el) => {
          const src = $(el).attr("src");
          const audioTag = $(el).parent();
          const brTag = $(audioTag).prev();
          // @ts-ignore
          const text = brTag[0].prev?.data
            ? // @ts-ignore
              brTag[0].prev?.data.replace(/\n/, "")
            : "";
          return {
            src: src || "",
            title: props.title,
            trackTitle: text,
            logoUrl: props.publisher.logoUrl,
          };
        })
        .toArray();
    }
    return undefined;
  }, [$, hasAudio, props.publisher.logoUrl, props.title]);

  const sourceNode = props.sourceLink ? (
    <div className="alert alert-warning">
      <div>Sumber Tulisan:</div>
      <a href={props.sourceLink} target="_blank" rel="noreferrer">
        {props.sourceLink}
      </a>
    </div>
  ) : null;

  return (
    <div className="p-4 md:px-8 mt-6">
      <div className="flex flex-row gap-2 mb-2 items-center">
        <img
          src={props.publisher.logoUrl}
          alt={props.publisher.name}
          width={24}
          height={24}
        />
        <div className="line-clamp-1">
          <span className="text-md">{props.publisher.name} </span>
          {props.authorName ? (
            <>
              <span className="text-sm">oleh </span>
              <span className="text-sm font-semibold">{props.authorName}</span>
            </>
          ) : null}
        </div>
      </div>
      <div className="flex flex-row gap-4 mt-4">
        <div className="flex flex-col flex-1 justify-between gap-8">
          <div className="gap-4 flex flex-col">
            <h1
              className="text-xl md:text-4xl font-bold capitalize"
              dangerouslySetInnerHTML={{ __html: props.title.toLowerCase() }}
            />
            <div className="flex flex-row gap-2 mt-1 items-center">
              <span className="text-gray-600 text-sm">{createdAt}</span>
              <BiCircle size={6} className="text-gray-600" />
              <span className="text-gray-600 text-sm">
                baca {Math.ceil(props.readDuration)} menit
              </span>
              <BiCircle size={6} className="text-gray-600 hidden sm:block" />
              <Link to={props.category.categoryUrl}>
                <span className="badge badge-secondary line-clamp-1 text-white">
                  {props.category.name}
                </span>
              </Link>
            </div>
            {hasAudio && audios ? (
              <div className="flex flex-col sm:flex-row-reverse gap-4">
                <div className="sm:w-1/2">
                  <div className="sm:hidden mb-4 sm:mb-0">{imageNode}</div>
                  <AudioList audios={audios} />
                </div>
                <div className="sm:w-1/2">
                  <div className="hidden sm:block mb-4">{imageNode}</div>
                  <div className="bg-base-200 rounded-md">
                    <div className="p-2">
                      <button
                        className="btn btn-sm btn-ghost w-full"
                        onClick={() => setDescVisibility((v) => !v)}
                      >
                        <div className="flex font-bold flex-1">Konten Asli</div>
                        {descShown ? (
                          <BiChevronUp size={18} />
                        ) : (
                          <BiChevronDown size={18} />
                        )}
                      </button>
                    </div>
                    {descShown ? (
                      <div className="p-5">{description}</div>
                    ) : null}
                  </div>
                  <div className="mt-4">{sourceNode}</div>
                </div>
              </div>
            ) : (
              <>
                {imageNode} {description} {sourceNode}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
