import Link from "next/link";
import type { PropsWithChildren, ReactNode } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { SideMenu } from "./sidemenu";

export type SharedLayoutProps = {
  footer?: ReactNode;
};

export function SharedLayout(props: PropsWithChildren<SharedLayoutProps>) {
  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="drawer drawer-mobile">
        <input id="drawer-1" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <header className="navbar border-b border-solid gap-2 bg-base-100 border-b-base-300">
            <div className="flex-none">
              <label
                htmlFor="drawer-1"
                className="btn-ghost btn-square btn drawer-button lg:hidden"
              >
                <HiMenuAlt2 size={20} />
              </label>
            </div>
            {/*  */}
            <div className="flex-1">
              <Link
                href="/"
                className="btn-ghost btn text-xl normal-case lg:hidden"
              >
                Al Faidah
              </Link>
            </div>
            <div className="flex-none gap-2 mr-2 ml-2">
              <a className="btn-ghost btn normal-case btn-sm">Masuk</a>
              <a className="btn-primary btn normal-case text-white btn-sm">
                Daftar
              </a>
            </div>
          </header>
          <main className="flex flex-col h-full bg-base-200 overflow-y-auto">
            {props.children}
          </main>
        </div>
        {/*  */}
        <div className="drawer-side border-r border-base-300">
          <label htmlFor="drawer-1" className="drawer-overlay"></label>
          <div className="bg-base-100 w-64">
            <div className="p-4">
              <Link href="/" className="btn-ghost btn text-xl normal-case">
                Al Faidah
              </Link>
            </div>
            <SideMenu />
            {/*  */}
          </div>
          {/*  */}
        </div>
        {/*  */}
      </div>
      {props.footer}
    </div>
  );
}
