import type { PropsWithChildren } from "react";
import { SharedLayout } from "~/components/shared-layout";

export default function ArticleLayout(props: PropsWithChildren) {
  return <SharedLayout>{props.children}</SharedLayout>;
}
