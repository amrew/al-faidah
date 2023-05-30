"use client";

import { HiOutlineHome, HiOutlineVolumeUp } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMedia } from "react-use";
import { useEffect, useRef } from "react";
import { clientCookies } from "~/clients/cookies";

export function SideMenu() {
  const pathname = usePathname();
  const focusClassName = "font-bold text-primary-focus";
  const isWide = useMedia("(min-width: 1024px)", false);
  const drawerRef = useRef<any>();

  useEffect(() => {
    drawerRef.current = document.getElementById("drawer-1");
  }, []);

  const clearDrawer = () => {
    if (!isWide) {
      drawerRef.current?.click();
    }
  };

  const changeTheme = (
    theme: "cupcake" | "pastel" | "corporate" | "lofi" | "dracula" | "autumn"
  ) => {
    clientCookies.set("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <>
      <ul className="menu w-56 p-2">
        <li className={pathname === "/" ? focusClassName : ""}>
          <Link href="/" onClick={clearDrawer}>
            <HiOutlineHome />
            Beranda
          </Link>
        </li>
        <li className={pathname.startsWith("/radio") ? focusClassName : ""}>
          <Link href="/radio" onClick={clearDrawer}>
            <HiOutlineVolumeUp />
            Radio
          </Link>
        </li>
      </ul>
      <div className=" pl-6 pt-4">
        <div className="text-xs mb-2">Theme:</div>
        <div className="flex flex-row items-center gap-2">
          <button
            className="w-3 h-3 bg-teal-400"
            onClick={() => changeTheme("cupcake")}
          />
          <button
            className="w-3 h-3 bg-purple-200"
            onClick={() => changeTheme("pastel")}
          />
          <button
            className="w-3 h-3 bg-blue-500"
            onClick={() => changeTheme("corporate")}
          />
          <button
            className="w-3 h-3 bg-slate-600"
            onClick={() => changeTheme("dracula")}
          />
          <button
            className="w-3 h-3 bg-black"
            onClick={() => changeTheme("lofi")}
          />
          <button
            className="w-3 h-3 bg-red-700"
            onClick={() => changeTheme("autumn")}
          />
        </div>
      </div>
    </>
  );
}
