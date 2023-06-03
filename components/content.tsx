import type { PropsWithChildren } from "react";

export function Content(props: PropsWithChildren<{ title: string }>) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{props.title}</h1>
      {props.children}
    </div>
  );
}
