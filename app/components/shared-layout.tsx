import { type PropsWithChildren, type ReactNode, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { SideMenu } from "./sidemenu";
import { MemberNavigation } from "./member-navigation";
import { Player } from "./player";
import { Link, useNavigate } from "@remix-run/react";
import { BiSearch } from "react-icons/bi";

export type SharedLayoutProps = {
  footer?: ReactNode;
  contentClassname?: string;
  keyword?: string;
  searchHref?: (value: string) => string;
};

export function SharedLayout(props: PropsWithChildren<SharedLayoutProps>) {
  const { contentClassname = "", keyword: queryKeyword = "" } = props;
  const [keyword, setKeyword] = useState(queryKeyword);
  const navigate = useNavigate();

  const onSearch = () => {
    const replaced = keyword.replace(" ", "+");
    const href = props.searchHref
      ? props.searchHref(replaced)
      : `/cari/artikel?q=${replaced}`;
    navigate(href);
  };

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
              className="btn-ghost btn text-xl normal-case lg:hidden"
            >
              Al Faidah
            </Link>
          </div>
          <div className="flex-1 relative hidden sm:block">
            <div className="absolute left-4 top-4">
              <BiSearch />
            </div>
            <input
              type="search"
              placeholder="Cari artikel..."
              className="input input-bordered pl-12 w-full md:w-2/3"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch();
                }
              }}
            />
          </div>
          <div className="flex-1 justify-end sm:hidden">
            <Link to="/cari/mobile" className="btn btn-ghost btn-circle btn-sm">
              <BiSearch />
            </Link>
          </div>
          <div className="flex-none gap-1">
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
