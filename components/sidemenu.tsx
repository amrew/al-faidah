"use client";

import {
  HiOutlineHome,
  HiOutlineVolumeUp,
  HiOutlineNewspaper,
} from "react-icons/hi";
import { BiRadio } from "react-icons/bi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMedia } from "react-use";
import { useEffect, useRef } from "react";

export function SideMenu() {
  const pathname = usePathname();
  const focusClassName = "active";
  const isWide = useMedia("(min-width: 1024px)", false);

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

  return (
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
  );
}
