import { type PropsWithChildren, type ReactNode } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { SideMenu } from "./sidemenu";
import { MemberNavigation } from "./member-navigation";
import { Player } from "./player";
import { Link } from "@remix-run/react";
import { BiSearch } from "react-icons/bi";

export type SharedLayoutProps = {
  footer?: ReactNode;
  contentClassname?: string;
  searchComponent?: ReactNode;
};

export function SharedLayout(props: PropsWithChildren<SharedLayoutProps>) {
  const { contentClassname = "" } = props;
  const hasSearchComponent = !!props.searchComponent;

  return (
    <div className="drawer lg:drawer-open flex flex-row-reverse flex-1 h-full">
      <input id="drawer-1" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col flex-1 h-full">
        <header className="navbar border-b border-solid gap-2 bg-base-200 border-b-base-300">
          <div className="flex-none">
            <label
              htmlFor="drawer-1"
              className="btn-ghost btn-square btn drawer-button lg:hidden"
            >
              <HiMenuAlt2 size={20} />
            </label>
          </div>
          {/*  */}
          <div className="flex-none">
            <Link
              to="/"
              className={`btn-ghost btn text-xl normal-case lg:hidden ${
                hasSearchComponent ? "hidden" : ""
              }`}
            >
              Al Faidah
            </Link>
          </div>
          {props.searchComponent}
          <div
            className={`flex-1 justify-end ${
              hasSearchComponent ? "hidden" : ""
            }`}
          >
            <Link to="/cari" className="btn btn-ghost btn-circle btn-sm">
              <BiSearch />
            </Link>
          </div>
          <div
            className={`flex-none gap-1 ${
              hasSearchComponent ? "hidden md:block" : ""
            }`}
          >
            <MemberNavigation />
          </div>
        </header>
        <main
          className={`flex flex-col flex-1 overflow-y-auto ${contentClassname}`}
        >
          {props.children}
        </main>
        <div>
          {props.footer}
          <Player />
        </div>
      </div>
      {/*  */}
      <div className="drawer-side border-r border-base-300">
        <label htmlFor="drawer-1" className="drawer-overlay"></label>
        <div className="bg-base-200 h-full">
          <div className="p-4">
            <Link to="/" className="btn-ghost btn text-xl normal-case">
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
  );
}
