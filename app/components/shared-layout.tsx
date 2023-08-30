import { type PropsWithChildren, type ReactNode } from "react";
import { MemberNavigation } from "./member-navigation";
import { Player } from "./player";
import { Link, NavLink } from "@remix-run/react";
import {
  BiHome,
  BiMicrophone,
  BiMoon,
  BiRadio,
  BiSearch,
  BiSun,
} from "react-icons/bi";
import { BackButton } from "./back-button";
import { twMerge } from "tailwind-merge";
import { Container } from "./container";
import { appConfig } from "~/utils/appConfig";
import { useTheme } from "~/hooks/useTheme";

export type SharedLayoutProps = {
  footer?: ReactNode;
  contentClassName?: string;
  searchComponent?: ReactNode;
  bottomNavShown?: boolean;
  hasBackButton?: boolean;
  playerShown?: boolean;
  disableContainer?: boolean;
};

export function SharedLayout(props: PropsWithChildren<SharedLayoutProps>) {
  const {
    hasBackButton,
    contentClassName,
    bottomNavShown = true,
    playerShown = true,
    disableContainer,
  } = props;
  const hasSearchComponent = !!props.searchComponent;
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-full">
      {!disableContainer ? (
        <div
          className={twMerge(
            "max-w-5xl mx-auto pb-36 sm:pb-20 pt-16 relative",
            contentClassName
          )}
        >
          {props.children}
        </div>
      ) : (
        props.children
      )}
      <header className="navbar items-start gap-2 bg-primary border-b-primary-focus border-b fixed top-0 left-0 right-0 z-10">
        <Container className="flex flex-1 gap-2">
          {hasBackButton ? (
            <div className="sm:hidden">
              <BackButton withText={false} />
            </div>
          ) : null}
          <div
            className={`flex-none items-center ${
              hasSearchComponent ? "hidden sm:flex" : ""
            }`}
          >
            <Link
              to="/"
              className={`btn-ghost btn text-xl normal-case text-primary-content`}
            >
              {appConfig.title}
            </Link>
            <button
              className="btn btn-circle btn-ghost btn-sm text-primary-content"
              type="button"
              onClick={toggleTheme}
            >
              {theme === appConfig.themeDark ? <BiMoon /> : <BiSun />}
            </button>
          </div>
          <div className="sm:flex-1 justify-center hidden sm:flex">
            <ul className="menu menu-sm menu-horizontal bg-base-200 rounded-box gap-2">
              <li>
                <NavLink to="/">Beranda</NavLink>
              </li>
              <li>
                <NavLink to="/radio">Radio</NavLink>
              </li>
              <li>
                <NavLink to="/tag/audio">Audio</NavLink>
              </li>
            </ul>
          </div>
          {props.searchComponent}
          <div
            className={`flex justify-end ${hasSearchComponent ? "hidden" : ""}`}
          >
            <Link
              to="/cari"
              className={`btn btn-circle btn-sm hidden sm:flex `}
            >
              <BiSearch />
            </Link>
          </div>
          <div
            className={`flex-1 sm:flex-none justify-end ${
              hasSearchComponent ? "hidden md:block" : ""
            }`}
          >
            <MemberNavigation />
          </div>
        </Container>
      </header>
      <div className="fixed bottom-0 left-0 w-full z-10">
        {props.footer}
        {playerShown ? <Player /> : null}
        {bottomNavShown ? (
          <div className="btm-nav btm-nav-sm border-t border-t-base-200 sm:hidden relative">
            <NavLink to="/" className="bg-base-200">
              <BiHome />
              <span className="text-xs">Beranda</span>
            </NavLink>
            <NavLink to="/radio" className="bg-base-200">
              <BiRadio />
              <span className="text-xs">Radio</span>
            </NavLink>
            <NavLink to="/tag/audio" className="bg-base-200">
              <BiMicrophone />
              <span className="text-xs">Audio</span>
            </NavLink>
            <NavLink to="/cari" className="bg-base-200">
              <BiSearch />
              <span className="text-xs">Cari</span>
            </NavLink>
          </div>
        ) : null}
      </div>
    </div>
  );
}
