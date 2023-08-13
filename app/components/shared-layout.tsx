import { type PropsWithChildren, type ReactNode } from "react";
import { MemberNavigation } from "./member-navigation";
import { Player } from "./player";
import { Link, NavLink } from "@remix-run/react";
import { BiHome, BiMicrophone, BiRadio, BiSearch } from "react-icons/bi";
import { BackButton } from "./back-button";
import { twMerge } from "tailwind-merge";

export type SharedLayoutProps = {
  footer?: ReactNode;
  contentClassName?: string;
  searchComponent?: ReactNode;
  bottomNavShown?: boolean;
  hasBackButton?: boolean;
  playerShown?: boolean;
};

export function SharedLayout(props: PropsWithChildren<SharedLayoutProps>) {
  const {
    hasBackButton,
    contentClassName,
    bottomNavShown = true,
    playerShown = true,
  } = props;
  const hasSearchComponent = !!props.searchComponent;

  return (
    <div className="h-full">
      <div
        className={twMerge(
          "max-w-5xl mx-auto pb-36 sm:pb-20 pt-16 relative",
          contentClassName
        )}
      >
        {props.children}
      </div>
      <header className="navbar border-b border-solid gap-2 bg-base-200 border-b-base-300 fixed top-0 left-0 right-0 z-10">
        {hasBackButton ? (
          <div className="sm:hidden">
            <BackButton withText={false} />
          </div>
        ) : null}
        <div
          className={`flex-none ${hasSearchComponent ? "hidden sm:flex" : ""}`}
        >
          <Link to="/" className={`btn-ghost btn text-xl normal-case`}>
            Al Faidah
          </Link>
        </div>
        <div className="flex-none hidden sm:flex">
          <ul className="menu menu-sm menu-horizontal bg-base-200 rounded-box gap-2">
            <li>
              <NavLink to="/">
                <BiHome size={20} /> Beranda
              </NavLink>
            </li>
            <li>
              <NavLink to="/radio">
                <BiRadio size={20} /> Radio
              </NavLink>
            </li>
            <li>
              <NavLink to="/tag/audio-islami">
                <BiMicrophone size={20} /> Audio
              </NavLink>
            </li>
          </ul>
        </div>
        {props.searchComponent}
        <div
          className={`flex-1 justify-end ${hasSearchComponent ? "hidden" : ""}`}
        >
          <Link
            to="/cari"
            className={`btn btn-ghost btn-circle btn-sm hidden sm:flex `}
          >
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
      <div className="fixed bottom-0 left-0 w-full">
        {props.footer}
        {playerShown ? <Player /> : null}
        {bottomNavShown ? (
          <div className="btm-nav btm-nav-sm border-t border-t-base-200 sm:hidden relative">
            <NavLink to="/" className="bg-white">
              <BiHome />
              <span className="text-xs">Beranda</span>
            </NavLink>
            <NavLink to="/radio" className="bg-white">
              <BiRadio />
              <span className="text-xs">Radio</span>
            </NavLink>
            <NavLink to="/tag/audio-islami" className="bg-white">
              <BiMicrophone />
              <span className="text-xs">Audio</span>
            </NavLink>
            <NavLink to="/cari" className="bg-white">
              <BiSearch />
              <span className="text-xs">Cari</span>
            </NavLink>
          </div>
        ) : null}
      </div>
    </div>
  );
}
