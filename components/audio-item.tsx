import Link from "next/link";
import { BiCircle, BiChevronRight } from "react-icons/bi";

export type AudioItemProps = {
  title: string;
  speaker: string;
  time?: string;
  audioCount: number;
  detailUrl: string;
};

export function AudioItem(props: AudioItemProps) {
  return (
    <div className="p-4 bg-base-200 rounded-md flex flex-row gap-4 border border-base-300">
      <div className="flex flex-col flex-1">
        <h2 className="text-lg font-bold">{props.title}</h2>
        <p>{props.speaker}</p>
        <div className="flex flex-row gap-2 items-center mt-1">
          {props.time ? (
            <>
              <span className="text-gray-600 text-sm">{props.time}</span>
              <BiCircle size={6} className="text-gray-600" />
            </>
          ) : null}
          <span className="text-gray-600 text-sm">
            {props.audioCount} Audio
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 self-center">
        <Link href={props.detailUrl} prefetch={false}>
          <button className="btn btn-ghost">
            Lihat <BiChevronRight />
          </button>
        </Link>
      </div>
    </div>
  );
}
