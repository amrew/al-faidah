import Link from "next/link";
import type { PropsWithChildren } from "react";
import { BackButton } from "~/components/back-button";
import { MemberNavigation } from "~/components/member-navigation";

export default function ArticleLayout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col flex-1 h-full">
      <header className="navbar border-b border-solid gap-2 bg-base-100 border-b-base-300">
        <div className="container mx-auto max-w-3xl">
          <div className="flex-none">
            <BackButton />
          </div>
          {/*  */}
          <div className="flex-1">
            <Link
              prefetch={false}
              href="/"
              className="btn-ghost btn text-xl normal-case"
            >
              Al Faidah
            </Link>
          </div>
          <div className="flex-none gap-1">
            <MemberNavigation />
          </div>
        </div>
      </header>
      <main className="flex flex-col flex-1 overflow-y-auto bg-base-200 py-6">
        {props.children}
      </main>
    </div>
  );
}
