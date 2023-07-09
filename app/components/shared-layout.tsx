import { type PropsWithChildren, type ReactNode } from "react";
import { MemberNavigation } from "./member-navigation";
import { Player } from "./player";
import { Link, NavLink } from "@remix-run/react";
import { BiHome, BiRadio, BiSearch } from "react-icons/bi";

export type SharedLayoutProps = {
  footer?: ReactNode;
  contentClassname?: string;
  searchComponent?: ReactNode;
};

export function SharedLayout(props: PropsWithChildren<SharedLayoutProps>) {
  const { contentClassname = "" } = props;
  const hasSearchComponent = !!props.searchComponent;

  return (
    <div className={contentClassname}>
      <header className="navbar border-b border-solid gap-2 bg-base-200 border-b-base-300 sticky top-0 left-0 right-0 z-50">
        <div className="flex-none">
          <Link to="/" className={`btn-ghost btn text-xl normal-case`}>
            Al Faidah
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-sm menu-horizontal bg-base-200 rounded-box gap-2">
            <li>
              <NavLink to="/">
                <BiHome size={20} />{" "}
                <span className="hidden md:inline">Beranda</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/radio">
                <BiRadio size={20} />{" "}
                <span className="hidden md:inline">Radio</span>
              </NavLink>
            </li>
          </ul>
        </div>
        {props.searchComponent}
        <div
          className={`flex-1 justify-end ${hasSearchComponent ? "hidden" : ""}`}
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
      <div className="max-w-5xl mx-auto pb-28">{props.children}</div>
      <div className="fixed bottom-0 left-0 w-full">
        {props.footer}
        <Player />
      </div>
    </div>
  );
}
