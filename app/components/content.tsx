import { Link } from "@remix-run/react";
import type { PropsWithChildren } from "react";

export function Content(
  props: PropsWithChildren<{
    title: string;
    moreHref?: string;
    className?: string;
  }>
) {
  return (
    <div className={`flex flex-col gap-4 ${props.className || ""}`}>
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">{props.title}</h1>
        {props.moreHref ? <Link to={props.moreHref}>Lihat semua</Link> : null}
      </div>
      {props.children}
    </div>
  );
}
