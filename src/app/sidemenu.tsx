"use client";

import {
  HiMenuAlt3,
  HiOutlineBookmark,
  HiOutlineHome,
  HiOutlineNewspaper,
  HiOutlineVolumeUp,
} from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideMenu() {
  const pathname = usePathname();
  const focusClassName = "font-bold text-primary-focus";
  return (
    <ul className="menu w-56 p-2">
      <li className={pathname === "/" ? focusClassName : ""}>
        <Link href="/">
          <HiOutlineHome />
          Beranda
        </Link>
      </li>
      <li className={pathname.startsWith("/radio") ? focusClassName : ""}>
        <Link href="/radio">
          <HiOutlineVolumeUp />
          Radio
        </Link>
      </li>
      <li>
        <a>
          <HiMenuAlt3 />
          Kategori
        </a>
      </li>
      <li>
        <a>
          <HiOutlineNewspaper />
          Artikel
        </a>
      </li>
      <li>
        <a>
          <HiOutlineBookmark />
          Disimpan
        </a>
      </li>
    </ul>
  );
}
