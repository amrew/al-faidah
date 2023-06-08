"use client";

import {
  HiOutlineHome,
  HiOutlineVolumeUp,
  HiOutlineNewspaper,
} from "react-icons/hi";
import { BiRadio } from "react-icons/bi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { useEffect, useRef, useTransition } from "react";
import { clientCookies } from "~/clients/cookies";
import type { ThemeName } from "./utils";
import { themes } from "./utils";

export function SideMenu() {
  const pathname = usePathname();
  const focusClassName = "active";
  const isWide = useMedia("(min-width: 1024px)", false);

  const router = useRouter();
  const [, startTransition] = useTransition();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawerRef = useRef<any>();

  useEffect(() => {
    drawerRef.current = document.getElementById("drawer-1");
  }, []);

  const clearDrawer = () => {
    if (!isWide) {
      drawerRef.current?.click();
    }
  };

  const changeTheme = (theme: ThemeName) => {
    clientCookies.set("theme", theme, { path: "/" });
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      <ul className="menu w-56 p-2 gap-2">
        <li>
          <Link
            href="/"
            onClick={clearDrawer}
            prefetch={false}
            className={pathname === "/" ? focusClassName : ""}
          >
            <HiOutlineHome size={24} />
            Beranda
          </Link>
        </li>
        <li>
          <Link
            href="/artikel"
            onClick={clearDrawer}
            prefetch={false}
            className={pathname.startsWith("/artikel") ? focusClassName : ""}
          >
            <HiOutlineNewspaper size={24} />
            Artikel
          </Link>
        </li>
        <li>
          <Link
            href="/radio"
            onClick={clearDrawer}
            prefetch={false}
            className={pathname === "/radio" ? focusClassName : ""}
          >
            <BiRadio size={24} />
            Radio
          </Link>
        </li>
        <li>
          <Link
            href="/c"
            onClick={clearDrawer}
            prefetch={false}
            className={pathname.startsWith("/c") ? focusClassName : ""}
          >
            <HiOutlineVolumeUp size={24} />
            Audio
          </Link>
        </li>
      </ul>
      <div className=" pl-6 pt-4">
        <div className="text-xs mb-2">Theme:</div>
        <div className="flex flex-row items-center gap-2">
          {themes.map(({ name, color }) => (
            <button
              key={name}
              className={`w-3 h-3 ${color}`}
              onClick={() => changeTheme(name)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
