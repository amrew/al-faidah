import dayjs from "dayjs";
import { Link } from "@remix-run/react";
import {
  BiChevronDown,
  BiChevronUp,
  BiCircle,
  BiError,
  BiLoader,
  BiNews,
} from "react-icons/bi";
import { FaShare } from "react-icons/fa";
import { TbBookmarkPlus } from "react-icons/tb";
import { BsBookmarkFill, BsShare } from "react-icons/bs";
import { RWebShare } from "react-web-share";
import * as cheerio from "cheerio";
import { type PropsWithChildren, useMemo, useState } from "react";
import { AudioList } from "~/components/audio/audio-list";
import relativeTime from "dayjs/plugin/relativeTime";
import striptags from "striptags";
import { useCompletion } from "~/hooks/useCompletion";
import "dayjs/locale/id";

dayjs.extend(relativeTime);
dayjs.locale("id");

export type ArticleItemProps = {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  readDuration: number;
  imageUrl?: string;
  terms: string[];
  publisher: {
    name: string;
    logoUrl: string;
    slug: string;
  };
  authorName?: string;
  detailUrl: string;
  metadata?: {
    answer?: string;
    source?: string;
    link?: string;
  } | null;
  gpt?: {
    summary: string;
    createdAt: string;
  } | null;
  link: string;
  toggleLikeLoading?: boolean;
  onLikeClick?: () => void;
  onUnlikeClick?: () => void;
  isLiked?: boolean;
};

export function ArticleItem(props: ArticleItemProps) {
  const date = dayjs(props.createdAt);
  const fullFormat = date.format("DD MMM YYYY");
  const fromNow = date.fromNow();
  const [imageShown, setImageVisibility] = useState(true);

  const wrapWithLink = (node: React.ReactNode) => {
    return <Link to={props.detailUrl}>{node}</Link>;
  };

  const imageNode = props.imageUrl ? (
    <img
      loading="lazy"
      src={props.imageUrl}
      alt={props.title}
      className="w-24 h-16 sm:w-48 sm:h-36 object-cover"
      onError={() => setImageVisibility(false)}
    />
  ) : null;

  return (
    <div className="border-b border-b-base-300 mb-8 pb-8">
      <div className="flex flex-row gap-1 mb-2 items-center">
        <img
          loading="lazy"
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
            <div className="gap-1 flex flex-col">
              <h1
                className="text-xl md:text-2xl font-bold line-clamp-2 capitalize"
                dangerouslySetInnerHTML={{
                  __html: striptags(props.title.toLowerCase()),
                }}
              />
              <div className="flex flex-row gap-2">
                <div>
                  <div
                    className="prose line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: striptags(props.content),
                    }}
                  />
                </div>
                {imageShown ? (
                  <div className="self-center flex sm:hidden">{imageNode}</div>
                ) : null}
              </div>
            </div>
          )}
          <div className="flex flex-row gap-2 mt-1 items-center">
            <div className="tooltip" data-tip={fullFormat}>
              <span className="text-gray-600 text-sm">{fromNow}</span>
            </div>
            <BiCircle size={6} className="text-gray-600" />
            <span className="text-gray-600 text-sm">
              baca {Math.ceil(props.readDuration)} menit
            </span>
          </div>
          <div className="flex flex-row flex-wrap gap-2 mt-2">
            {props.terms?.slice(0, 2).map((term) => (
              <Link
                key={term}
                to={`/tag/${term}`}
                className="link link-secondary font-bold btn-xs no-underline"
              >
                #{term}
              </Link>
            ))}
          </div>
        </div>
        {imageShown ? (
          <div className="h-full hidden sm:flex self-center">
            {wrapWithLink(imageNode)}
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex flex-row gap-2">
        <RWebShare
          data={{
            title: props.title,
            text: props.content,
            url: props.detailUrl,
          }}
          sites={["whatsapp", "telegram", "mail", "copy"]}
        >
          <button
            className={`btn btn-outline btn-sm btn-circle`}
            aria-label="Share"
          >
            <BsShare />
          </button>
        </RWebShare>
        {!props.toggleLikeLoading ? (
          <button
            className={`btn btn-sm ${
              props.isLiked ? "btn-accent" : "btn-outline"
            }`}
            onClick={props.isLiked ? props.onUnlikeClick : props.onLikeClick}
            aria-label={`${
              props.isLiked ? "Hilangkan Artikel" : "Simpan Artikel"
            }`}
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
          to={props.detailUrl}
          className="btn btn-neutral btn-sm text-white"
        >
          Selengkapnya <FaShare />
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
  props: Omit<ArticleItemProps, "content" | "createdAt" | "sourceLink">
) {
  return (
    <div className="border-b border-b-base-300 mb-2 pb-2">
      <div className="flex flex-row gap-1 mb-2 items-center">
        <img
          loading="lazy"
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

type SummaryGeneratorProps = {
  hasAudio: boolean;
  defaultSummary: string;
  createdAt: string;
  publisher: {
    slug: string;
    name: string;
  };
  slug: string;
  sourceLink: string;
};

export function SummaryGenerator(
  props: PropsWithChildren<SummaryGeneratorProps>
) {
  const [contentShown, setContentShown] = useState(true);

  const { state: summaryState, fetch: getGPTSummary } = useCompletion({
    url: `/api/completion/summary`,
    result: props.defaultSummary,
  });

  const buttonSummary = (
    <button
      className="btn btn-accent btn-sm"
      onClick={() => {
        getGPTSummary({
          slug: props.slug,
          publisher: props.publisher.slug,
        });
      }}
    >
      Lihat Rangkuman
      <BiNews />
    </button>
  );

  return (
    <>
      {summaryState.type !== "idle" && summaryState.type !== "error" ? (
        <>
          <div>
            <h3 className="font-bold text-lg flex flex-row gap-2 items-center">
              Rangkuman
              <span className="text-sm text-error">(Eksperimen)</span>
              {summaryState.type === "fetching" ? (
                <BiLoader className="animate-spin" />
              ) : null}
            </h3>
            <span className="text-sm text-orange-500">
              *Catatan: Rangkuman ini dibuat oleh <strong>ChatGPT</strong>,
              belum tentu hasilnya selalu bagus.
            </span>
          </div>
          <div className="prose lg:prose-lg mb-4 max-w-2xl bg-base-300 rounded-md">
            <div
              className="px-4 py-2"
              dangerouslySetInnerHTML={{
                __html: summaryState.value,
              }}
            />
            {props.createdAt ? (
              <div className="px-6 pb-4 text-sm text-right">
                dibuat {dayjs(props.createdAt).fromNow()}
              </div>
            ) : null}
          </div>
        </>
      ) : summaryState.type === "error" ? (
        <div className="alert alert-error">
          <BiError />
          <div>
            <strong>Gagal mengambil rangkuman.</strong>
            <br /> Ada kesalahan pada sistem atau artikel terlalu panjang.
          </div>
        </div>
      ) : null}

      {!props.hasAudio ? (
        <div className="mb-4">
          {summaryState.type === "idle" ? buttonSummary : null}
        </div>
      ) : null}

      {!props.hasAudio && !contentShown ? (
        <div className="relative h-60 overflow-hidden px-4 rounded-md max-w-2xl">
          {props.children}
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-base-100 flex flex-row gap-2 justify-center items-end p-4">
            <button
              className="btn btn-accent btn-sm"
              onClick={() => setContentShown(true)}
            >
              Selengkapnya
              <BiChevronDown />
            </button>
          </div>
        </div>
      ) : (
        <div>{props.children}</div>
      )}
    </>
  );
}

export function ArticleDetail(
  props: { sourceLink: string } & ArticleItemProps
) {
  const [descShown, setDescVisibility] = useState(false);

  const date = dayjs(props.createdAt);
  const fullFormat = date.format("DD MMM YYYY");
  const fromNow = date.fromNow();

  const hasAudio = props.content.includes("<audio");
  const $ = cheerio.load(props.content);

  const gpt = props.gpt;

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
        className={"prose lg:prose-lg max-w-2xl prose-pre:whitespace-pre-wrap"}
        dangerouslySetInnerHTML={{ __html: props.metadata.answer }}
      />
    </div>
  ) : (
    <div
      className={"prose lg:prose-lg max-w-2xl prose-pre:whitespace-pre-wrap"}
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  );

  const withSummary = (
    <SummaryGenerator
      hasAudio={hasAudio}
      defaultSummary={gpt?.summary || ""}
      createdAt={gpt?.createdAt || ""}
      publisher={{
        slug: props.publisher.slug,
        name: props.publisher.name,
      }}
      slug={props.slug}
      sourceLink={props.link}
    >
      {description}
    </SummaryGenerator>
  );

  const imageNode = props.imageUrl ? (
    <div className="max-w-2xl">
      <img
        loading="lazy"
        src={props.imageUrl}
        alt={props.title}
        className="w-full h-96 object-cover rounded-md"
      />
    </div>
  ) : null;

  const audios = useMemo(() => {
    if (hasAudio) {
      const playlistJson = $(".wp-playlist-script");
      const jsonText = playlistJson.text();

      if (jsonText) {
        try {
          const json = JSON.parse(jsonText);
          return json.tracks.map((item: any) => ({
            src: item.src,
            title: item.title,
            trackTitle: item.description,
            logoUrl: item.image.src,
          }));
        } catch (err) {
          return [];
        }
      } else {
        let elements = $("audio source").length
          ? $("audio source")
          : $("audio");

        const items = elements.map((i, el) => {
          return $(el);
        });

        return items
          ?.map((i, el) => {
            const src = $(el).attr("src");
            const audioTag = $(el).parent();
            const brTag = $(audioTag).prev();
            const trackTitleDefault = `${props.title} ${
              items.length > 1 ? i + 1 : ""
            }`;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const text = brTag[0]?.prev?.data
              ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                brTag[0]?.prev?.data.replace(/\n/, "").trim() ||
                `${trackTitleDefault}`
              : `${trackTitleDefault}`;
            return {
              src: src || "",
              title: props.title,
              trackTitle: text,
              logoUrl: props.publisher.logoUrl,
            };
          })
          .toArray();
      }
    }
    return undefined;
  }, [$, hasAudio, props.publisher.logoUrl, props.title]);

  const sourceNode = props.sourceLink ? (
    <div>
      <div className="alert max-w-2xl grid-flow-row grid-cols-1">
        {props.authorName ? (
          <div>
            <div className="font-bold">Oleh:</div>
            <div>{props.authorName}</div>
          </div>
        ) : null}
        {props.metadata?.source ? (
          <div>
            <div className="font-bold">Rujukan:</div>
            <a
              href={props.metadata.link}
              target="_blank"
              rel="noreferrer"
              className="line-clamp-1 underline"
            >
              {props.metadata.source}
            </a>
          </div>
        ) : null}
        <div>
          <div className="font-bold">Sumber Tulisan:</div>
          <a
            href={props.sourceLink}
            target="_blank"
            rel="noreferrer"
            className="line-clamp-1 underline"
          >
            {props.title}
          </a>
        </div>
      </div>
    </div>
  ) : null;

  const tagsNode = (
    <div className="flex flex-row flex-wrap gap-2">
      {props.terms.map((term) => (
        <Link
          key={term}
          to={`/tag/${term}`}
          className="link link-secondary font-bold no-underline"
        >
          #{term}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:px-8 mt-6">
      <div className="flex flex-row gap-2 mb-2 items-center">
        <img
          loading="lazy"
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
              <div className="tooltip" data-tip={fullFormat}>
                <span className="text-gray-600 text-sm">{fromNow}</span>
              </div>
              <BiCircle size={6} className="text-gray-600" />
              <span className="text-gray-600 text-sm">
                baca {Math.ceil(props.readDuration)} menit
              </span>
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
                        aria-label="Lihat konten asli"
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
                      <div className="p-5">{withSummary}</div>
                    ) : null}
                    <div className="px-5 pb-4">{tagsNode}</div>
                  </div>
                  <div className="mt-4">{sourceNode}</div>
                </div>
              </div>
            ) : (
              <>
                {imageNode} {withSummary} {tagsNode} {sourceNode}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
