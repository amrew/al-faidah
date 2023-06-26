import {
  HiOutlineHome,
  // HiOutlineVolumeUp,
  HiOutlineNewspaper,
} from "react-icons/hi";
import { BiRadio } from "react-icons/bi";
import { useMedia } from "react-use";
import { useEffect, useRef } from "react";
import { NavLink } from "@remix-run/react";

export function SideMenu() {
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
        <NavLink
          to="/"
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? focusClassName : ""
          }
          onClick={clearDrawer}
        >
          <HiOutlineHome size={24} />
          Beranda
        </NavLink>
      </li>
      {/* <li>
        <NavLink
          to="/artikel"
          onClick={clearDrawer}
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? focusClassName : ""
          }
        >
          <HiOutlineNewspaper size={24} />
          Artikel
        </NavLink>
      </li> */}
      <li>
        <NavLink
          to="/radio"
          onClick={clearDrawer}
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? focusClassName : ""
          }
        >
          <BiRadio size={24} />
          Radio
        </NavLink>
      </li>
      {/* <li>
        <NavLink
          to="/audio"
          onClick={clearDrawer}
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? focusClassName : ""
          }
        >
          <HiOutlineVolumeUp size={24} />
          Audio
        </NavLink>
      </li> */}
    </ul>
  );
}
